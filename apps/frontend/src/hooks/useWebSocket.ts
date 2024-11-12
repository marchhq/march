// import { useState, useEffect } from "react"

// interface WebSocketMessage {
//   type: string
//   item: any // Replace 'any' with your item type
// }

// export const useWebSocket = () => {
//   const [items, setItems] = useState<any[]>([]) // Replace 'any' with your item type

//   useEffect(() => {
//     // Create WebSocket connection
//     const ws = new WebSocket(`ws://${window.location.host}`)

//     ws.onopen = () => {
//       console.log("Connected to WebSocket")
//     }

//     ws.onmessage = (event) => {
//       try {
//         const data: WebSocketMessage = JSON.parse(event.data)
//         if (data.type === "INBOX_UPDATE") {
//           setItems((prevItems) => [...prevItems, data.item])
//         }
//       } catch (error) {
//         console.error("Error parsing WebSocket message:", error)
//       }
//     }

//     ws.onerror = (error) => {
//       console.error("WebSocket error:", error)
//     }

//     ws.onclose = () => {
//       console.log("Disconnected from WebSocket")
//     }

//     // Cleanup on unmount
//     return () => {
//       ws.close()
//     }
//   }, [])

//   return { items }
// }

"use client"

import { useState, useEffect } from "react"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"

export const useWebSocket = () => {
  const { addInboxItem } = useCycleItemStore()

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.host}`)

    ws.onopen = () => {
      console.log("Connected to WebSocket")
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === "INBOX_UPDATE") {
          // Update Zustand store with new item
          addInboxItem(data.item)
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    ws.onclose = () => {
      console.log("Disconnected from WebSocket")
      // Implement reconnection logic if needed
      setTimeout(() => {
        useWebSocket()
      }, 3000)
    }

    return () => {
      ws.close()
    }
  }, [addInboxItem])
}
