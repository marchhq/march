"use client";

import * as React from "react";
import {
  DropdownMenuCheckboxItem,
} from "@radix-ui/react-dropdown-menu";
import { Space as SpaceIcon } from "@/src/lib/icons/Space";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown";
import { useSpace } from "../hooks/useSpace";
import { Check } from 'lucide-react';
import { Space } from "../lib/@types/Items/Space";
import axios from "axios";
import { BACKEND_URL } from "../lib/constants/urls";
import { useAuth } from "../contexts/AuthContext";

export function AddToSpace({ itemUuid }) {
  const [selectedSpaces, setSelectedSpaces] = React.useState<string[]>([]);
  const { pages: spaces } = useSpace() || { pages: [] };
  const { session } = useAuth();

  const handleToggleSpace = async (spaces: Space) => {
    try {
      const newSelectedSpaces = selectedSpaces.includes(spaces._id)
        ? selectedSpaces.filter(id => id !== spaces._id)
        : [...selectedSpaces, spaces._id];

      setSelectedSpaces(newSelectedSpaces)

      await axios.put(`${BACKEND_URL}/api/items/${itemUuid}`, {
        pages: newSelectedSpaces,
      }, {
        headers: {
          Authorization: `Bearer ${session}`
        }
      })

    } catch (error) {
      console.error("error updating space: ", error)
    }
  }

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
            onCheckedChange={() => handleToggleSpace(space)}
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
