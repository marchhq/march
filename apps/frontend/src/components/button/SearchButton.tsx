import { useEffect } from "react"

import { SearchIcon } from "lucide-react"

import { useSearchStore } from "@/src/lib/store/search.store"

export const SearchButton = () => {
  const { open } = useSearchStore()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        open()
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open])

  return (
    <button className="block w-full">
      <SearchIcon
        size={18}
        className="hover-text cursor-pointer text-primary-foreground"
      />
    </button>
  )
}
