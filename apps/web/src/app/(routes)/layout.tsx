"use client";

import { AssistantModal } from "@/components/assistant-ui/assistant-modal";
// import { SearchDialog } from "@/components/dialogs/search/search-dialog";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="w-full bg-white">
          <HeaderWithToggle />
          <div className="container pl-0 pr-0">{children}</div>
          <AssistantModal />
          <Toaster />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function HeaderWithToggle() {
  return (
    <div className="h-12 bg-white flex items-center px-3">
      <SidebarTrigger />
    </div>
  );
}
