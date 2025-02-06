// import { useState } from "react"

// import { useMutation } from "@tanstack/react-query"
// import { EventSourcePolyfill } from "event-source-polyfill"

// import { BACKEND_URL } from "../lib/constants/urls"

// // function for creating streaming request
// const createStreamRequest = (
//   query: string,
//   session: string,
//   onChunk: (chunk: string) => void
// ) => {
//   return new Promise((resolve, reject) => {
//     const eventSource = new EventSourcePolyfill(
//       `${BACKEND_URL}/ai/ask?query=${encodeURIComponent(query)}`,
//       {
//         headers: {
//           Authorization: `Bearer ${session}`,
//           Accept: "text/event-stream",
//         },
//         withCredentials: false,
//       }
//     )

//     eventSource.addEventListener("message", (event) => {
//       try {
//         const parsedData = JSON.parse(event.data)
//         // console.log("Parsed data:", parsedData)
//         if (parsedData.done) {
//           eventSource.close()
//           resolve(true)
//         } else if (parsedData.chunk) {
//           onChunk(parsedData.chunk)
//         }
//       } catch (error) {
//         console.error("Error parsing message:", error)
//       }
//     })

//     eventSource.addEventListener("error", (error) => {
//       console.error("SSE Error:", error)
//       eventSource.close()
//       reject(error)
//     })
//   })
// }

// export const useAskMutation = (session: string) => {
//   const [currentChunk, setCurrentChunk] = useState<string>("")

//   const mutation = useMutation({
//     mutationFn: async (query: string) => {
//       setCurrentChunk("") // Reset at start
//       return createStreamRequest(query, session, (chunk) => {
//         setCurrentChunk((prev) => {
//           const newValue = prev + chunk
//           return newValue
//         })
//       })
//     },
//   })

//   return {
//     ...mutation,
//     currentChunk,
//   }
// }

import { useState, useRef } from "react"

import { useMutation } from "@tanstack/react-query"
import { EventSourcePolyfill } from "event-source-polyfill"

import { BACKEND_URL } from "../lib/constants/urls"

const createStreamRequest = (
  query: string,
  session: string,
  onChunk: (chunk: string) => void
) => {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSourcePolyfill(
      `${BACKEND_URL}/ai/ask?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${session}`,
          Accept: "text/event-stream",
        },
        withCredentials: false,
      }
    )

    eventSource.addEventListener("message", (event) => {
      try {
        const parsedData = JSON.parse(event.data)
        if (parsedData.done) {
          eventSource.close()
          resolve(true)
        } else if (parsedData.chunk) {
          onChunk(parsedData.chunk)
        }
      } catch (error) {
        console.error("Error parsing message:", error)
      }
    })

    eventSource.addEventListener("error", (error) => {
      console.error("SSE Error:", error)
      eventSource.close()
      reject(error)
    })

    return eventSource
  })
}

export const useAskMutation = (session: string) => {
  const [currentChunk, setCurrentChunk] = useState<string>("")
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null)

  const mutation = useMutation({
    mutationFn: async (query: string) => {
      setCurrentChunk("") // Reset at start

      // Close previous SSE connection if still active
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }

      const eventSource = await createStreamRequest(query, session, (chunk) => {
        setCurrentChunk((prev) => prev + chunk)
      })

      eventSourceRef.current = eventSource
    },
    onSettled: () => {
      eventSourceRef.current = null // Clean up SSE connection
    },
  })

  return {
    ...mutation,
    currentChunk,
  }
}
