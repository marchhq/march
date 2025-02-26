"use client";

import { AssistantModal } from "@/components/assistant-ui/assistant-modal";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import { useInboxObjects, useTodayObjects } from "@/hooks/use-objects";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-white">
        <div className="h-12 bg-white flex items-center px-4 gap-3">
          <SidebarTrigger />
          <PageTitle />
        </div>
        <div className="container">{children}</div>
        <AssistantModal />
        <Toaster />
      </main>
    </SidebarProvider>
  );
}

function PageTitle() {
  const pathname = usePathname();
  const { data: inboxObjects } = useInboxObjects();
  
  let title = "";
  if (pathname === "/inbox") {
    title = "Inbox";
    if (inboxObjects) {
      return (
        <div className="flex items-center gap-2">
          <h1 className="font-medium text-base">{title}</h1>
          <span className="text-gray-400 text-base">{inboxObjects.length}</span>
        </div>
      );
    }
  } else if (pathname === "/today") {
    title = "Agenda";
  } else {
    // Default or other pages
    title = "Empty Array";
  }
  
  return <h1 className="font-medium text-base">{title}</h1>;
}
