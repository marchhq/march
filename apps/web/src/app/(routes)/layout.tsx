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
        <main className="w-full bg-[#F2F2F2]">
          <div className="h-12 border-b bg-white flex items-center px-4 gap-3">
            <SidebarTrigger />
            <h1 className="font-medium text-base">Today</h1>
          </div>
          <div className="container">{children}</div>
          <AssistantModal />
          <Toaster />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
