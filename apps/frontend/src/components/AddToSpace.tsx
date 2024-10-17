"use client"
import * as React from "react"

import { DropdownMenuCheckboxItem } from "@radix-ui/react-dropdown-menu"
import axios from "axios"
import { Check } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown"
import { useAuth } from "../contexts/AuthContext"
import { useSpace } from "../hooks/useSpace"
import { Space } from "../lib/@types/Items/Space"
import { BACKEND_URL } from "../lib/constants/urls"
import useSpaceStore from "../lib/store/space.store"
import { Space as SpaceIcon } from "@/src/lib/icons/Space"

export function AddToSpace({ itemId }) {
  const [selectedSpaces, setSelectedSpaces] = React.useState<string[]>([])
  // const { spaces: spaces } = useSpace() || { spaces: [] }
  const { session } = useAuth()
  const { spaces, fetchSpaces } = useSpaceStore()

  React.useEffect(() => {
    if (session) {
      fetchSpaces(session)
    }
  }, [session])

  const handleToggleSpace = async (spaces: Space) => {
    try {
      const newSelectedSpaces = selectedSpaces.includes(spaces._id)
        ? selectedSpaces.filter((id) => id !== spaces._id)
        : [...selectedSpaces, spaces._id]
      setSelectedSpaces(newSelectedSpaces)

      await axios.put(
        `${BACKEND_URL}/api/inbox/${itemId}/`,
        {
          spaces: newSelectedSpaces,
        },
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
    } catch (error) {
      console.error("error updating space: ", error)
    }
  }

  if (!spaces?.length) {
    return <div>Loading...</div>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <SpaceIcon />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 cursor-pointer space-y-2 border border-neutral-200 bg-background-active p-2 text-white shadow-sm dark:border-neutral-800">
        {spaces.map((space) => (
          <DropdownMenuCheckboxItem
            key={space._id}
            checked={selectedSpaces.includes(space._id)}
            onCheckedChange={() => handleToggleSpace(space)}
            className="flex items-center space-x-2"
          >
            <div className="flex size-4 items-center justify-center">
              {selectedSpaces.includes(space._id) && (
                <Check className="text-white" />
              )}
            </div>
            <span>{space.name}</span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
