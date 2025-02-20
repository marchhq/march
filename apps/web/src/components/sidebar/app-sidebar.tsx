"use client";
import { LogOut, Plus, Settings, UserCircle } from "lucide-react";
import { useState } from "react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IntegrationsDialog } from "@/components/integrations-dialog";
import Link from "next/link";

export function AppSidebar() {
  const [integrationsOpen, setIntegrationsOpen] = useState(false);

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 px-2 py-1.5 text-sm w-full hover:bg-accent hover:text-accent-foreground">
                  <UserCircle className="h-4 w-4" />
                  <span>john doe</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onSelect={() => setIntegrationsOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Integrations</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <IntegrationsDialog open={integrationsOpen} onOpenChange={setIntegrationsOpen} />
    </Sidebar>
  );
}
