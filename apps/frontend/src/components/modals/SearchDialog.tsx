"use client"

import { useEffect, useState } from "react"

import { useQuery } from "@tanstack/react-query"
import { debounce } from "lodash"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import { useAuth } from "@/src/contexts/AuthContext"
import { searchItems } from "@/src/lib/server/actions/search-items"
import { useSearchStore } from "@/src/lib/store/search.store"
import { useSearch } from "@/src/queries/useSearch"

export const SearchDialog = () => {
  const { session } = useAuth()
  const { isOpen, close } = useSearchStore()
  const [search, setSearch] = useState("")
  const { data: items, isLoading, isFetching } = useSearch(search, session)

  useEffect(() => {
    if (!isOpen) {
      setSearch("")
    }
  }, [isOpen])

  const handleSearch = debounce((value: string) => {
    setSearch(value)
  }, 300)

  return (
    <CommandDialog open={isOpen} onOpenChange={close}>
      <CommandInput
        placeholder="search for an object..."
        onValueChange={handleSearch}
      />
      <CommandList className="h-[600px]">
        {(isLoading || isFetching) && <div>loading...</div>}

        {!isLoading && !isFetching && items?.length === 0 && (
          <CommandEmpty>no object found</CommandEmpty>
        )}
        {items?.map((item) => (
          <CommandItem key={item._id} className="text-primary-foreground">
            {item.title}
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
