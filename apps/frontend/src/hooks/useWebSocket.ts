// import { useEffect, useState } from "react"

// import { useCycleItemStore } from "../lib/store/cycle.store"
// import { ACCESS_TOKEN } from "@/src/lib/constants/cookie"

// console.log("ssaju: ", ACCESS_TOKEN)

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
//     const newSocket = new WebSocket(WEBSOCKET_URL, ACCESS_TOKEN)

//     newSocket.onopen = () => {
//       setIsConnected(true)
//       console.log("WebSocket connection established")
//     }

//     newSocket.onmessage = async (event) => {
//       try {
//         let message

//         if (event.data instanceof Blob || event.data instanceof ArrayBuffer) {
//           const arrayBuffer =
//             event.data instanceof Blob
//               ? await event.data.arrayBuffer()
//               : event.data
//           const textDecoder = new TextDecoder("utf-8")
//           const decodedMessage = textDecoder.decode(arrayBuffer)
//           message = JSON.parse(decodedMessage)
//         } else {
//           message = JSON.parse(event.data.toString())
//         }
//         if (message.type === "linear" && message.item) {
//           setMessages((prevMessages) => [...prevMessages, message.item])
//           updateStateWithNewItem(message.item)
//         }
//       } catch (error) {
//         console.error("Error processing WebSocket message:", error)
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
//   }, [ACCESS_TOKEN])

//   const sendMessage = (message: any, isBinary: boolean = false) => {
//     if (socket && socket.readyState === WebSocket.OPEN) {
//       if (isBinary) {
//         const binaryMessage = new TextEncoder().encode(JSON.stringify(message))
//         socket.send(binaryMessage)
//       } else {
//         socket.send(JSON.stringify(message))
//       }
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
import { getSession } from "@/src/lib/server/actions/sessions"

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL

if (!WEBSOCKET_URL) {
  throw new Error(
    "NEXT_PUBLIC_WEBSOCKET_URL is not defined in the environment."
  )
}

let socketInstance: WebSocket | null = null

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const { updateStateWithNewItem } = useCycleItemStore()

  useEffect(() => {
    const initializeWebSocket = async () => {
      if (socketInstance) {
        console.log("WebSocket is already connected")
        return
      }

      try {
        const session = await getSession()
        console.log("session", session)
        socketInstance = new WebSocket(WEBSOCKET_URL, session)

        socketInstance.onopen = () => {
          setIsConnected(true)
          console.log("WebSocket connection established")
        }

        socketInstance.onmessage = async (event) => {
          try {
            let message

            if (
              event.data instanceof Blob ||
              event.data instanceof ArrayBuffer
            ) {
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

            if (message?.type === "linear" && message?.item) {
              setMessages((prevMessages) => [...prevMessages, message.item])
              updateStateWithNewItem(message.item)
            }
          } catch (error) {
            console.error("Error processing WebSocket message:", error)
          }
        }

        socketInstance.onclose = () => {
          setIsConnected(false)
          console.log("WebSocket connection closed")
          socketInstance = null
        }

        socketInstance.onerror = (error) => {
          console.error("WebSocket error:", error)
        }
      } catch (error) {
        console.error("Error initializing WebSocket:", error)
      }
    }

    initializeWebSocket() // Call the async function inside useEffect

    // Cleanup function to close the WebSocket on unmount
    return () => {
      if (socketInstance) {
        socketInstance.close()
        socketInstance = null
      }
    }
  }, []) // Only run once on mount

  const sendMessage = (message: any, isBinary: boolean = false) => {
    if (socketInstance && socketInstance.readyState === WebSocket.OPEN) {
      const msgToSend = isBinary
        ? new TextEncoder().encode(JSON.stringify(message)) // Convert message to binary
        : JSON.stringify(message)

      socketInstance.send(msgToSend)
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
