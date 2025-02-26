"use client";
import { Plus, Calendar, Inbox } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { IntegrationsDialog } from "../dialogs/integration/integrations-dialog";
import IntegrationMenu from "../dialogs/integration/integration";

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [integrationsOpen, setIntegrationsOpen] = useState(false);

  return (
    <>
      <Sidebar collapsible="icon" className="bg-white border-r border-gray-200">
        <SidebarHeader>
          <div className="p-2 px-4">
            <h2 className="text-sm font-medium text-gray-900">March 0.1</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/inbox"
                      className={cn(
                        "flex items-center gap-3 px-2 py-1.5 text-sm",
                        pathname === "/inbox" &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      <Inbox
                        className={cn(
                          "h-4 w-4",
                          isCollapsed 
                            ? "text-gray-300" 
                            : pathname === "/inbox" 
                              ? "text-accent-foreground" 
                              : "text-foreground/70"
                        )}
                      />
                      <span>Inbox</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/today"
                      className={cn(
                        "flex items-center gap-3 px-2 py-1.5 text-sm",
                        pathname === "/today" &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      <Calendar
                        className={cn(
                          "h-4 w-4",
                          isCollapsed 
                            ? "text-gray-300" 
                            : pathname === "/today" 
                              ? "text-accent-foreground" 
                              : "text-foreground/70"
                        )}
                      />
                      <span>Agenda</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button 
                      onClick={() => setIntegrationsOpen(true)}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm w-full text-muted-foreground hover:text-foreground"
                    >
                      <Plus className={cn(
                        "h-4 w-4",
                        isCollapsed ? "text-gray-300" : "text-foreground/70"
                      )} />
                      <span>Add source</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <IntegrationMenu />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <IntegrationsDialog
        open={integrationsOpen}
        onOpenChange={setIntegrationsOpen}
      />
    </>
  );
}
