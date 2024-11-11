import { useEffect, useState, useCallback } from "react"

import { useCycleItemStore } from "@/src/lib/store/cycle.store" // Update import path

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080"

interface WebSocketMessage {
  type: string
  data?: any
  error?: string
}

export const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { setInboxItems, fetchInbox } = useCycleItemStore() // Get both setInboxItems and fetchInbox

  // Memoize the message handler
  const handleMessage = useCallback(
    (message: WebSocketMessage) => {
      console.log("Received message:", message)

      switch (message.type) {
        case "inbox_update":
          if (Array.isArray(message.data)) {
            setInboxItems(message.data)
          }
          break
        case "item_created":
        case "item_updated":
        case "item_deleted":
          // Refresh the inbox when items are modified
          fetchInbox()
          break
        case "error":
          console.error("WebSocket error:", message.error)
          break
        default:
          console.log("Unknown message type:", message.type)
      }
    },
    [setInboxItems, fetchInbox]
  )

  // Memoize the connection setup
  const setupWebSocket = useCallback(() => {
    try {
      const newSocket = new WebSocket(WEBSOCKET_URL)

      newSocket.onopen = () => {
        setIsConnected(true)
        console.log("WebSocket connection established")
        // Subscribe to inbox updates
        newSocket.send(JSON.stringify({ type: "subscribe_inbox" }))
      }

      newSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage
          handleMessage(message)
        } catch (error) {
          console.error("Error parsing message:", error)
        }
      }

      newSocket.onclose = () => {
        setIsConnected(false)
        console.log("WebSocket connection closed")
        // Attempt to reconnect after 3 seconds
        setTimeout(setupWebSocket, 3000)
      }

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error)
        setIsConnected(false)
      }

      setSocket(newSocket)

      return newSocket
    } catch (error) {
      console.error("Error setting up WebSocket:", error)
      return null
    }
  }, [handleMessage])

  // Set up WebSocket connection
  useEffect(() => {
    const ws = setupWebSocket()

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [setupWebSocket])

  // Memoize the sendMessage function
  const sendMessage = useCallback(
    (message: any) => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message))
      } else {
        console.warn("WebSocket is not connected")
      }
    },
    [socket]
  )

  return {
    isConnected,
    sendMessage,
  }
}
