import { useState, useRef } from "react"

import { useMutation } from "@tanstack/react-query"
import { EventSourcePolyfill } from "event-source-polyfill"

import { BACKEND_URL } from "../lib/constants/urls"

const createStreamRequest = (
  query: string,
  session: string,
  onChunk: (chunk: string) => void,
  callbacks?: {
    onComplete?: () => void
    onError?: (error: Error) => void
  }
): EventSourcePolyfill => {
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
        callbacks?.onComplete?.()
        eventSource.close()
      } else if (parsedData.chunk) {
        onChunk(parsedData.chunk)
      }
    } catch (error) {
      callbacks?.onError?.(error)
      console.error("Error parsing message:", error)
      eventSource.close()
    }
  })

  eventSource.addEventListener("error", (error) => {
    console.error("SSE Error:", error)
    eventSource.close()
  })

  return eventSource
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

      // Return a Promise that resolves when streaming is complete
      return new Promise((resolve, reject) => {
        try {
          eventSourceRef.current = createStreamRequest(
            query,
            session,
            (chunk) => {
              setCurrentChunk((prev) => prev + chunk)
            },
            // Add these callback handlers
            {
              onComplete: () => {
                resolve(true)
                eventSourceRef.current?.close()
                eventSourceRef.current = null
              },
              onError: (error) => {
                reject(error)
                eventSourceRef.current?.close()
                eventSourceRef.current = null
              },
            }
          )
        } catch (error) {
          reject(error)
          eventSourceRef.current?.close()
          eventSourceRef.current = null
        }
      })
    },
    onSettled: () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    },
  })

  return {
    ...mutation,
    currentChunk,
  }
}
