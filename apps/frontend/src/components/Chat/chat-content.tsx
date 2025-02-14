"use client"

import React, { useEffect, useRef, useState } from "react"

import { ScrollArea } from "../ui/scroll-area"
import { ChatTextarea } from "@/src/components/textarea/chat-textarea"
import { TextEffect } from "@/src/components/ui/text-effect"
import { useAuth } from "@/src/contexts/AuthContext"
import { Message } from "@/src/lib/@types/Items/Chat"
import { useAskMutation } from "@/src/queries/useAsk"

interface MessageBubbleProps {
  message: Message | null
  isLoading?: boolean
}

function MessageBubble({ message, isLoading = false }: MessageBubbleProps) {
  if (!message && !isLoading) return null

  return (
    <div className={`mb-4 ${message?.isUser ? "text-right" : "text-left"}`}>
      <div
        className={`inline-block rounded-lg p-2 px-4 ${
          message?.isUser
            ? "bg-primary-foreground text-white"
            : "rounded-xl border bg-primary text-black shadow-sm"
        }`}
      >
        <div className="whitespace-pre-wrap text-sm">
          {isLoading ? (
            <div className="loader"></div>
          ) : (
            <p>{message?.content}</p>
          )}
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
    if (!mutation.isPending && textareaRef.current) {
      textareaRef.current.focus()
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
    <main className="relative flex h-full flex-col">
      <div className="absolute inset-x-0 bottom-24 top-0 overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <h1 className="text-center text-4xl font-bold">
              <TextEffect per="char" preset="fade">
                what do you need done?
              </TextEffect>
            </h1>
          </div>
        ) : (
          <ScrollArea
            ref={scrollAreaRef}
            className="h-full [&>div>div]:!scroll-smooth"
          >
            <div className="px-8 pt-6">
              {messages.map((message, index) => (
                <MessageBubble
                  key={index}
                  message={message}
                  isLoading={false}
                />
              ))}
              {mutation.isLoading && <MessageBubble message={null} isLoading />}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-background">
        <div className="mx-auto max-w-2xl p-4">
          <ChatTextarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSubmit={handleSubmit}
            placeholder="describe your request in detail..."
            disabled={mutation.isPending}
          />
        </div>
      </div>
    </main>
  )
}
