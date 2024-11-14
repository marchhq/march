import { useEffect, useState } from "react"

const WEBSOCKET_URL = "ws://localhost:8080"

export const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    const newSocket = new WebSocket(WEBSOCKET_URL)

    newSocket.onopen = () => {
      setIsConnected(true)
      console.log("WebSocket connection established")
    }

    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data.toString())
      setMessages((prevMessages) => [...prevMessages, message])
      console.log("Received message:", message)
    }

    newSocket.onclose = () => {
      setIsConnected(false)
      console.log("WebSocket connection closed")
    }

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    setSocket(newSocket)

    return () => {
      if (newSocket) {
        newSocket.close()
      }
    }
  }, [])

  const sendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    } else {
      console.warn("Cannot send message, WebSocket is not open")
    }
  }

  return {
    isConnected,
    messages,
    sendMessage,
  }
}
