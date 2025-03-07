"use client";

import { WebSocketProvider } from "@/contexts/websocket-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const queryClient = new QueryClient();

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider>{children}</WebSocketProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" /> */}
    </QueryClientProvider>
  );
}
