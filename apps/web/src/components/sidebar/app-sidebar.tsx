"use client";
import { Plus, Calendar, Inbox, Bot } from "lucide-react";
// import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
} from "@/components/ui/sidebar";
import Link from "next/link";
import IntegrationMenu from "../dialogs/integration/integration";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="bg-white border-r">
      <SidebarHeader>
        <div className="p-4 flex justify-start pl-4">
          {/* Logo hidden for now
          <Image 
            src="/icons/logo.svg" 
            alt="Logo" 
            width={24} 
            height={24} 
            className="h-6 w-auto"
          />
          */}
        </div>
      </SidebarHeader>
      <SidebarContent className="mt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/inbox"
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm rounded-md transition-colors",
                      pathname === "/inbox"
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-[#6E6E6E] hover:text-foreground hover:bg-[#F5F5F5]"
                    )}
                  >
                    <Inbox
                      className={cn(
                        "h-5 w-5",
                        pathname === "/inbox" 
                          ? "text-accent-foreground" 
                          : "text-[#6E6E6E]"
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
                      "flex items-center gap-3 px-4 py-2.5 text-sm rounded-md transition-colors",
                      pathname === "/today"
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-[#6E6E6E] hover:text-foreground hover:bg-[#F5F5F5]"
                    )}
                  >
                    <Calendar
                      className={cn(
                        "h-5 w-5",
                        pathname === "/today" 
                          ? "text-accent-foreground" 
                          : "text-[#6E6E6E]"
                      )}
                    />
                    <span>Agenda</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-[#6E6E6E] hover:text-foreground rounded-md transition-colors hover:bg-[#F5F5F5]">
                    <Bot className="h-5 w-5 text-[#6E6E6E]" />
                    <span>Agent</span>
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
  );
}
