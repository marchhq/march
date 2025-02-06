"use client"

import React, { useEffect, useRef, useState } from "react"

import { ScrollArea } from "../ui/scroll-area"
import { ChatTextarea } from "@/src/components/textarea/chat-textarea"
import { TextEffect } from "@/src/components/ui/text-effect"
import { useAuth } from "@/src/contexts/AuthContext"
import { Message } from "@/src/lib/@types/Items/Chat"
import { useAskMutation } from "@/src/queries/useAsk"

function MessageBubble({
  message,
}: {
  message: Message | null
  isStreaming?: boolean
}) {
  if (!message) {
    return null
  }

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

  useEffect(() => {
    if (!mutation.currentChunk) return

    setMessages((prevMessages) => {
      const newMessages = [...prevMessages]

      // If we have a streaming message reference and it's the last message
      if (streamingMessageRef.current) {
        const lastMessageIndex = newMessages.length - 1
        // Update the content of the last message
        newMessages[lastMessageIndex] = {
          ...newMessages[lastMessageIndex],
          content:
            newMessages[lastMessageIndex].content + mutation.currentChunk,
        }
      } else {
        // Create a new message for the first chunk
        const newMessage = {
          content: mutation.currentChunk,
          isUser: false,
        }
        newMessages.push(newMessage)
        streamingMessageRef.current = newMessage
      }

      return newMessages
    })
  }, [mutation.currentChunk])

  // Reset streaming message ref when request completes
  useEffect(() => {
    if (!mutation.isPending) {
      streamingMessageRef.current = null
    }
  }, [mutation.isPending])

  // Cleanup on unmount
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

    mutation.mutate(trimmedInput, {
      onError: () => {
        setMessages((prev) => [
          ...prev,
          {
            content: "Sorry, couldn't process your request. Please try again.",
            isUser: false,
          },
        ])
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
          <ScrollArea className="no-scrollbar h-[50vh] [&>div>div]:!scroll-smooth">
            <>
              {messages.map((message, index) => (
                <MessageBubble
                  key={index}
                  message={message}
                  isStreaming={
                    index === messages.length - 1 && mutation.isPending
                  }
                />
              ))}
            </>
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
