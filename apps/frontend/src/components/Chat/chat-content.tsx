"use client"

import React, { useState } from "react"

import { ScrollArea } from "../ui/scroll-area"
import { TextShimmerWave } from "../ui/text-shimmer-wave"
import { ChatTextarea } from "@/src/components/textarea/chat-textarea"
import { TextEffect } from "@/src/components/ui/text-effect"
import { useAuth } from "@/src/contexts/AuthContext"
import { Message } from "@/src/lib/@types/Items/Chat"
import { useAskMutation } from "@/src/queries/useAsk"

function MessageBubble({ message }: { message: Message }) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedInput = input.trim()
    if (!trimmedInput) return

    //add user message
    setMessages((prev) => [...prev, { content: trimmedInput, isUser: true }])
    setInput("")

    //trigger ai response
    mutation.mutate(trimmedInput, {
      onSuccess: (data) => {
        setMessages((prev) => [
          ...prev,
          { content: data.answer, isUser: false },
        ])
      },
      onError: () => {
        setMessages((prev) => [
          ...prev,
          {
            content: "sorry, couldnt process your request. please try again",
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
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            {mutation.isPending && (
              <div className="text-center">
                <TextShimmerWave className="font-mono text-sm" duration={1}>
                  march assistant is thinking...
                </TextShimmerWave>
              </div>
            )}
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
