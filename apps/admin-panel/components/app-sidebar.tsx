"use client";
import { Calendar, Inbox, Search, Settings, Users2Icon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter from Next.js
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";

// Menu items.
const items = [
  {
    title: "Users",
    url: "/",
    icon: Users2Icon,
  },
  {
    title: "Inbox",
    url: "/inbox", // Update to actual path
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "/calendar", // Update to actual path
    icon: Calendar,
  },
  {
    title: "Search",
    url: "/search", // Update to actual path
    icon: Search,
  },
  {
    title: "Settings",
    url: "/settings", // Update to actual path
    icon: Settings,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const currentPath = usePathname(); 

  return (
    <Sidebar>
        <SidebarContent className="dark:bg-black">
        <SidebarGroup>
          <SidebarGroupContent>

           <div className={`${state === "collapsed" ? 'flex flex-col-reverse gap-2' : 'flex justify-between'} mb-2`}>
            <ThemeToggle/>
            <SidebarTrigger/>
           </div>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={state === "collapsed" ? item.title : ""} asChild>
                    <a
                      href={item.url}
                      className={`flex items-center p-2 rounded-md ${
                        currentPath === item.url
                          ? "bg-blue-500 text-white" // Active item styles
                          : "text-gray-300 hover:bg-blue-600 hover:text-white"
                      }`}
                    >
                      <item.icon className="mr-2" />
                      {state === "expanded" && <span>{item.title}</span>} {/* Show title only when expanded */}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}