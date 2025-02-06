"use client"

import React, { useEffect, useRef, useState } from "react"

import { ScrollArea } from "../ui/scroll-area"
import { ChatTextarea } from "@/src/components/textarea/chat-textarea"
import { TextEffect } from "@/src/components/ui/text-effect"
import { useAuth } from "@/src/contexts/AuthContext"
import { Message } from "@/src/lib/@types/Items/Chat"
import { useAskMutation } from "@/src/queries/useAsk"

function MessageBubble({ message }: { message: Message | null }) {
  if (!message) return null

  return (
    <div className={`mb-4 ${message.isUser ? "text-right" : "text-left"}`}>
      <div
        className={`inline-block rounded-lg p-2 px-4 ${
          message.isUser
            ? "bg-primary-foreground text-white"
            : "rounded-xl border bg-primary text-black shadow-sm"
        }`}
      >
        <div className="whitespace-pre-wrap text-sm">
          <p>{message.content}</p>
        </div>
      </div>
    </div>
  )
}

export const ChatContentPage = () => {
  const { session } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const mutation = useAskMutation(session)
  const streamingMessageRef = useRef<Message | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollableDiv = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      )
      if (scrollableDiv) {
        scrollableDiv.scrollTop = scrollableDiv.scrollHeight
      }
    }
  }

  useEffect(() => {
    if (!mutation.currentChunk) return

    console.log("Current chunk received:", mutation.currentChunk)

    setMessages((prevMessages) => {
      const newMessages = [...prevMessages]
      if (streamingMessageRef.current) {
        // Update the last message if it's still streaming
        streamingMessageRef.current.content = mutation.currentChunk
        newMessages[newMessages.length - 1] = { ...streamingMessageRef.current }
      } else {
        // Add new assistant message and store reference
        const newMessage = { content: mutation.currentChunk, isUser: false }
        newMessages.push(newMessage)
        streamingMessageRef.current = newMessage
      }
      return [...newMessages]
    })

    // Scroll to bottom whenever content updates
    requestAnimationFrame(scrollToBottom)
  }, [mutation.currentChunk])

  useEffect(() => {
    if (!mutation.isPending) {
      streamingMessageRef.current = null
    }
  }, [mutation.isPending])

  useEffect(() => {
    return () => {
      streamingMessageRef.current = null
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedInput = input.trim()
    if (!trimmedInput) return

    setMessages((prev) => [...prev, { content: trimmedInput, isUser: true }])
    setInput("")

    // Scroll to bottom after sending message
    requestAnimationFrame(scrollToBottom)

    mutation.mutate(trimmedInput, {
      onError: () => {
        setMessages((prev) => [
          ...prev,
          {
            content: "Sorry, couldn't process your request. Please try again.",
            isUser: false,
          },
        ])
        // Scroll to bottom on error message
        requestAnimationFrame(scrollToBottom)
      },
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-center text-4xl font-bold">
          <TextEffect per="char" preset="fade">
            what do you need done?
          </TextEffect>
        </h1>

        {messages.length > 0 ? (
          <ScrollArea
            ref={scrollAreaRef}
            className="no-scrollbar h-[50vh] [&>div>div]:!scroll-smooth"
          >
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
          </ScrollArea>
        ) : (
          <div></div>
        )}

        <ChatTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={handleSubmit}
          placeholder="describe your request in detail..."
          disabled={mutation.isPending}
        />
      </div>
    </main>
  )
}
