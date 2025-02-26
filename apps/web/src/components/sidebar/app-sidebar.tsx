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
} from "@/components/ui/sidebar";
import Link from "next/link";
import IntegrationMenu from "../dialogs/integration/integration";

export function AppSidebar() {
  const pathname = usePathname();

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
                        "h-4 w-4 text-foreground/70",
                        pathname === "/inbox" && "text-accent-foreground"
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
                        "h-4 w-4 text-foreground/70",
                        pathname === "/today" && "text-accent-foreground"
                      )}
                    />
                    <span>Today</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button className="flex items-center gap-2 px-2 py-1.5 text-sm w-full text-muted-foreground hover:text-foreground">
                    <Plus className="h-4 w-4 text-foreground/70" />
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
            <IntegrationMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
