"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, UserCircle } from "lucide-react";
import { useState } from "react";
import { IntegrationsDialog } from "./integrations-dialog";
import { useUser } from "@/hooks/use-user";
import Image from "next/image";

export default function IntegrationMenu() {
  const { data: user } = useUser();
  const [integrationsOpen, setIntegrationsOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 px-2 py-1.5 text-sm w-full hover:bg-accent hover:text-accent-foreground">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt="avatar"
                width={20}
                height={20}
                className="rounded-full"
              />
            ) : (
              <UserCircle className="h-4 w-4 text-foreground/70" />
            )}
            <span>{user?.fullName ?? "john doe"}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onSelect={() => setIntegrationsOpen(true)}>
            <Settings className="mr-2 h-4 w-4 text-foreground/70" />
            <span>Integrations</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4 text-foreground/70" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <IntegrationsDialog
        open={integrationsOpen}
        onOpenChange={setIntegrationsOpen}
      />
    </>
  );
}
