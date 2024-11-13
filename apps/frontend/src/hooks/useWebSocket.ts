import { useEffect, useState } from "react"

import { useCycleItemStore } from "../lib/store/cycle.store"

const WEBSOCKET_URL = "ws://localhost:8080" // Replace with backend WebSocket URL

export const useWebSocket = (session) => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const { createItem } = useCycleItemStore()

  // Separate effect for handling messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.type === "INBOX_UPDATE") {
        createItem(session, lastMessage.data)
      }
    }
  }, [messages, session, createItem])

  useEffect(() => {
    if (!session) return

    let ws: WebSocket | null = null

    const connect = () => {
      ws = new WebSocket(WEBSOCKET_URL)

      ws.onopen = () => {
        setIsConnected(true)
        console.log("WebSocket connection established")
      }

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data.toString())
        console.log("Received message:", message)
        setMessages((prev) => [...prev, message])
      }

      ws.onclose = () => {
        setIsConnected(false)
        console.log("WebSocket connection closed")
        // Attempt to reconnect after a delay
        setTimeout(connect, 3000)
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
      }

      setSocket(ws)
    }

    connect()

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [session])

  const sendMessage = (message: any) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    }
  }

  return {
    isConnected,
    messages,
    sendMessage,
  }
}
