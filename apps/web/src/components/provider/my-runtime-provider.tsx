"use client";

import type { ReactNode } from "react";
import {
  AssistantRuntimeProvider,
  TextContentPart,
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react";
import { apiClient } from "@/lib/api";
import axios from "axios";
import { BACKEND_URL } from "@/lib/constants";
import { useAuth } from "@/contexts/auth-context";
import { extractMessageData } from "@/lib/utils";

interface MyModelAdapterConfig {
  session: string;
}

const createModelAdapter = (
  config: MyModelAdapterConfig
): ChatModelAdapter => ({
  async run({ messages, abortSignal }) {
    // Get the last message and extract its text content
    const lastMessage = messages[messages.length - 1];
    const textContent =
      lastMessage.content.find(
        (part): part is TextContentPart => part.type === "text"
      )?.text || "";

    const data = await axios.get(
      `${BACKEND_URL}/ai/ask?query=${encodeURIComponent(textContent)}`,
      {
        headers: {
          Authorization: `Bearer ${config.session}`,
        },
        signal: abortSignal,
      }
    );

    const text = extractMessageData(data);

    return {
      content: [
        {
          type: "text",
          text: text,
        },
      ],
    };
  },
});

export function MyRuntimeProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { session } = useAuth();
  const modelAdapter = createModelAdapter({ session });
  const runtime = useLocalRuntime(modelAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
