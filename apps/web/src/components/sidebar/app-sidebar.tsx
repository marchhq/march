"use client";
import { Plus, UserCircle } from "lucide-react";

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

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="p-2" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-2">
            <SidebarGroupLabel>Arrays</SidebarGroupLabel>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/inbox" className="flex items-center gap-3 px-2 py-1.5 text-sm">
                    <span className="text-muted-foreground font-mono tracking-tighter">()</span>
                    <span>Inbox</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/today" className="flex items-center gap-3 px-2 py-1.5 text-sm">
                    <span className="text-muted-foreground font-mono tracking-tighter">()</span>
                    <span>Today</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button className="flex items-center gap-2 px-2 py-1.5 text-sm w-full text-muted-foreground hover:text-foreground">
                    <Plus className="h-4 w-4" />
                    <span>Create array</span>
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
            <SidebarMenuButton asChild>
              <Link href="#" className="flex items-center gap-3 px-2 py-1.5 text-sm">
                <UserCircle className="h-4 w-4" />
                <span>john doe</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
