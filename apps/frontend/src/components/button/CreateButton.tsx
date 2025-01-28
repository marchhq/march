import { useEffect } from "react"

import Image from "next/image"

import { useCreateStore } from "@/src/lib/store/create.store"
import SpaceIcon from "public/icons/spacesicon.svg"

export const CreateButton = () => {
  const { open } = useCreateStore()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "c" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        open()
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open])

  return (
    <button onClick={open} className="block w-full">
      <Image
        src={SpaceIcon}
        alt="add item"
        width={18}
        height={18}
        className="hover-text cursor-pointer text-primary-foreground"
      />
    </button>
  )
}
