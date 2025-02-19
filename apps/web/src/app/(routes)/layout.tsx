import { AssistantModal } from "@/components/assistant-ui/assistant-modal";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        <div className="container px-4">{children}</div>
        <AssistantModal />
      </main>
    </SidebarProvider>
  );
}
