"use client";

import type { ReactNode } from "react";
import {
  AssistantRuntimeProvider,
  TextContentPart,
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react";
import { BACKEND_URL } from "@/lib/constants";

const MyModelAdapter: ChatModelAdapter = {
  async run({ messages, abortSignal }) {
    // Get the last message and extract its text content
    const lastMessage = messages[messages.length - 1];
    const textContent =
      lastMessage.content.find(
        (part): part is TextContentPart => part.type === "text",
      )?.text || "";

    // Make the request to your endpoint
    const result = await fetch(
      `${BACKEND_URL}/ai/ask?query=${encodeURIComponent(textContent)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortSignal,
      },
    );

    const data = await result.json();

    return {
      content: [
        {
          type: "text",
          text: data.data,
        },
      ],
    };
  },
};

export function MyRuntimeProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const runtime = useLocalRuntime(MyModelAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
