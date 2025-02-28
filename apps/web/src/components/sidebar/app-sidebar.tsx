"use client";
import { Calendar, Inbox, Bot } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import IntegrationMenu from "../dialogs/integration/integration";

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="bg-white border-r">
      <SidebarHeader>
        <div className="p-4 flex justify-start pl-4">
          {/* Empty header space */}
        </div>
      </SidebarHeader>
      <SidebarContent className="mt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/inbox"
                className={cn(
                  "flex items-center text-sm rounded-md transition-colors",
                  isCollapsed 
                    ? "justify-center py-3 px-0 mx-auto w-full" 
                    : "gap-3 px-4 py-2.5",
                  pathname === "/inbox"
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-[#6E6E6E] hover:text-foreground hover:bg-[#F5F5F5]"
                )}
              >
                <Inbox
                  className={cn(
                    pathname === "/inbox" 
                      ? "text-accent-foreground" 
                      : "text-[#6E6E6E]",
                    isCollapsed ? "h-7 w-7" : "h-5 w-5"
                  )}
                />
                {!isCollapsed && <span>Inbox</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/today"
                className={cn(
                  "flex items-center text-sm rounded-md transition-colors",
                  isCollapsed 
                    ? "justify-center py-3 px-0 mx-auto w-full" 
                    : "gap-3 px-4 py-2.5",
                  pathname === "/today"
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-[#6E6E6E] hover:text-foreground hover:bg-[#F5F5F5]"
                )}
              >
                <Calendar
                  className={cn(
                    pathname === "/today" 
                      ? "text-accent-foreground" 
                      : "text-[#6E6E6E]",
                    isCollapsed ? "h-7 w-7" : "h-5 w-5"
                  )}
                />
                {!isCollapsed && <span>Agenda</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className={cn(
                "flex items-center text-sm w-full text-[#6E6E6E] hover:text-foreground rounded-md transition-colors hover:bg-[#F5F5F5]",
                isCollapsed 
                  ? "justify-center py-3 px-0 mx-auto" 
                  : "gap-3 px-4 py-2.5"
              )}>
                <Bot className={cn(
                  "text-[#6E6E6E]",
                  isCollapsed ? "h-7 w-7" : "h-5 w-5"
                )} />
                {!isCollapsed && <span>Agent</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <IntegrationMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
