"use client";

import * as React from "react";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuCheckboxItemProps,
} from "@radix-ui/react-dropdown-menu";
import { Space as SpaceIcon } from "@/src/lib/icons/Space";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown";
import { useSpace } from "../hooks/useSpace";
import { Check } from 'lucide-react';

type Checked = DropdownMenuCheckboxItemProps["checked"];

export function AddToSpace() {
  const [selectedSpaces, setSelectedSpaces] = React.useState<string[]>([]);
  const { pages: spaces } = useSpace() || { pages: [] };

  const handleToggleSpace = (spaceId: string) => {
    setSelectedSpaces((prevSelected) =>
      prevSelected.includes(spaceId)
        ? prevSelected.filter((id) => id !== spaceId)
        : [...prevSelected, spaceId]
    );
  };

  if (!spaces.length) {
    return <div>Loading...</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <SpaceIcon />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-white bg-background-active space-y-2 p-2 cursor-pointer border border-neutral-200 dark:border-neutral-800 shadow-sm">
        {spaces.map((space) => (
          <DropdownMenuCheckboxItem
            key={space._id}
            checked={selectedSpaces.includes(space._id)}
            onCheckedChange={() => handleToggleSpace(space._id)}
            className="flex items-center space-x-2"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              {selectedSpaces.includes(space._id) && (
                <Check className="text-white" />
              )}
            </div>
            <span>{space.name}</span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
