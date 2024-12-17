"use client"

import React from "react"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@radix-ui/react-dropdown-menu';
import { CircleHelp, SearchIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../atoms/Tooltip"

const SidebarNav = () => {
  const [searchResults, setSearchResults] = React.useState([]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Input
          type="text"
          placeholder="Search..."
          onChange={(e) => {
            const query = e.target.value;
            if (query) {
              fetch(`/items/search/?q=${query}`)
                .then(response => response.json())
                .then(data => setSearchResults(data)) // Assume setSearchResults is a state setter for search results
                .catch(error => console.error('Error fetching search results:', error));
            }
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {searchResults.map((result, index) => (
          <DropdownMenuItem key={index}>
            {result.name} {/* Adjust based on actual data structure */}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
import { useTrackPageView } from "@/src/hooks/useTrackPageView"
import { useUserInfo } from "@/src/hooks/useUserInfo"
import SpaceIcon from "public/icons/spacesicon.svg"

export const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col">
      <SidebarNav />
    </div>
  )
}

const SidebarNav: React.FC = () => {
  const { user } = useUserInfo()
  useTrackPageView(user?.userName || "")
  return (
    <nav className="flex h-screen bg-background p-4 text-sm text-secondary-foreground">
      <div className="flex h-5/6 flex-col justify-center gap-4">
        <div className="space-y-6 rounded-full border border-border p-3">
          <div className="block w-full">
            <Input
              type="text"
              placeholder="Search..."
              onChange={(e) => {
                const query = e.target.value;
                if (query) {
                  fetch(`/items/search/?q=${query}`)
                    .then(response => response.json())
                    .then(data => console.log(data)) // Replace with actual handling logic
                    .catch(error => console.error('Error fetching search results:', error));
                }
              }}
            />
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="block w-full">
                  <Image
                    src={SpaceIcon}
                    alt="add item"
                    width={18}
                    height={18}
                    className="cursor-pointer text-primary-foreground hover:text-white"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>coming soon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div>
            <Link href={"https://march.userjot.com/"} target="_blank">
              <CircleHelp
                className="text-primary-foreground hover:text-white"
                size={18}
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
