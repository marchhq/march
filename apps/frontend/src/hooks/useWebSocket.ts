// import { useEffect, useState } from "react"

// import { useCycleItemStore } from "../lib/store/cycle.store"

// const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL

// if (!WEBSOCKET_URL) {
//   throw new Error(
//     "NEXT_PUBLIC_WEBSOCKET_URL is not defined in the environment."
//   )
// }

// export const useWebSocket = () => {
//   const [socket, setSocket] = useState<WebSocket | null>(null)
//   const [isConnected, setIsConnected] = useState(false)
//   const [messages, setMessages] = useState<any[]>([])
//   const { updateStateWithNewItem } = useCycleItemStore()

//   useEffect(() => {
//     const newSocket = new WebSocket(WEBSOCKET_URL)

//     newSocket.onopen = () => {
//       setIsConnected(true)
//       console.log("WebSocket connection established")
//     }

//     newSocket.onmessage = (event) => {
//       try {
//         const message = JSON.parse(event.data.toString())
//         if (message.type === "linear" && message.item) {
//           setMessages((prevMessages) => [...prevMessages, message.item])
//           updateStateWithNewItem(message.item)
//         }
//         console.log("Received message:", message)
//       } catch (error) {
//         console.error("Error parsing WebSocket message:", error)
//       }
//     }

//     newSocket.onclose = () => {
//       setIsConnected(false)
//       console.log("WebSocket connection closed")
//     }

//     newSocket.onerror = (error) => {
//       console.error("WebSocket error:", error)
//     }

//     setSocket(newSocket)

//     return () => {
//       if (newSocket) {
//         newSocket.close()
//       }
//     }
//   }, [])

//   const sendMessage = (message: any) => {
//     if (socket && socket.readyState === WebSocket.OPEN) {
//       socket.send(JSON.stringify(message))
//     } else {
//       console.warn("Cannot send message, WebSocket is not open")
//     }
//   }

//   return {
//     isConnected,
//     messages,
//     sendMessage,
//   }
// }

import { useEffect, useState } from "react"

import { useCycleItemStore } from "../lib/store/cycle.store"

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL

if (!WEBSOCKET_URL) {
  throw new Error(
    "NEXT_PUBLIC_WEBSOCKET_URL is not defined in the environment."
  )
}

export const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const { updateStateWithNewItem } = useCycleItemStore()

  useEffect(() => {
    const newSocket = new WebSocket(WEBSOCKET_URL)

    newSocket.onopen = () => {
      setIsConnected(true)
      console.log("WebSocket connection established")
    }

    newSocket.onmessage = async (event) => {
      try {
        let message

        if (event.data instanceof Blob || event.data instanceof ArrayBuffer) {
          const arrayBuffer =
            event.data instanceof Blob
              ? await event.data.arrayBuffer()
              : event.data
          const textDecoder = new TextDecoder("utf-8")
          const decodedMessage = textDecoder.decode(arrayBuffer)
          message = JSON.parse(decodedMessage)
        } else {
          message = JSON.parse(event.data.toString())
        }
        if (message.type === "linear" && message.item) {
          setMessages((prevMessages) => [...prevMessages, message.item])
          updateStateWithNewItem(message.item)
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error)
      }
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

  const sendMessage = (message: any, isBinary: boolean = false) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      if (isBinary) {
        const binaryMessage = new TextEncoder().encode(JSON.stringify(message))
        socket.send(binaryMessage)
      } else {
        socket.send(JSON.stringify(message))
      }
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
