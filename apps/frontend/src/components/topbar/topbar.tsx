"use client"

import { useEffect, useMemo, useState } from "react"

import { Parentheses } from "lucide-react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

import ActionHeader from "../ActionHeader"
import { NoteStackModal } from "../Notes/components/NoteModal/NotesModal"
import { useNoteHandlers } from "../Notes/hooks/useNoteHandlers"
import { useNoteState } from "../Notes/hooks/useNoteState"
import { useAuth } from "@/src/contexts/AuthContext"
import { useMeetsStore } from "@/src/lib/store/meets.store"
import useNotesStore from "@/src/lib/store/notes.store"
import useUserStore from "@/src/lib/store/user.store"

export const Topbar = () => {
  const params = useParams()
  const pathname = usePathname()
  const spaceId = params?.spaceId as string
  const blockId = params?.blockId as string
  const itemId = params?.itemId as string

  const { session } = useAuth()
  const { user, fetchUser } = useUserStore()
  const { notes, fetchNotes } = useNotesStore()
  const { state, dispatch } = useNoteState()
  const { meets, fetchMeets } = useMeetsStore()
  const { note } = state
  const { addNewNote } = useNoteHandlers(state, dispatch, spaceId, blockId)
  const [isStackOpen, setIsStackOpen] = useState(false)
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 })

  useEffect(() => {
    fetchUser(session)
    fetchNotes(session, spaceId, blockId)
    fetchMeets(session)
  }, [session])

  const toggleStack = () => {
    setIsStackOpen(!isStackOpen)
  }

  const isMeetingRoute = useMemo(() => {
    return itemId?.includes("_20")
  }, [itemId])

  const stackItems = useMemo(() => {
    if (isMeetingRoute) {
      return (
        meets?.map((m) => ({
          id: m.id,
          title: m.title || "Untitled",
          href: `/spaces/${spaceId}/blocks/${blockId}/items/${m.id}`,
          createdAt: m.createdAt,
          isActive: m.id === itemId,
        })) || []
      )
    }

    return (
      notes?.map((n) => ({
        id: n._id,
        title: n.title || "Untitled",
        href: `/spaces/${spaceId}/blocks/${blockId}/items/${n._id}`,
        createdAt: n.createdAt,
        isActive: n._id === note?._id,
      })) || []
    )
  }, [isMeetingRoute, notes, meets, spaceId, blockId, itemId, note])

  return (
    <div className="flex h-10 items-center justify-between px-8">
      <div className="flex-1"></div>

      <div className="flex items-center space-x-2">
        <Link
          href={"https://github.com/emptyarrayai/march"}
          target="_blank"
          className="pt-px"
        >
          <Parentheses
            size={18}
            className="hover-text text-secondary-foreground"
          />
        </Link>
        <span className="size-1 rounded-full bg-secondary-foreground"></span>
        <Link href="/profile">
          <p className="text-sm text-secondary-foreground hover:text-primary-foreground">
            {user?.userName || user?.fullName}
          </p>
        </Link>
      </div>

      <div className="flex flex-1 justify-end">
        {spaceId && blockId && (
          <>
            <ActionHeader
              closeToggle={isStackOpen}
              onAdd={isMeetingRoute ? undefined : addNewNote}
              onButtonPositionChange={setButtonPosition}
              onClose={toggleStack}
            />
            {isStackOpen && (
              <NoteStackModal
                notes={stackItems}
                handleClose={toggleStack}
                buttonPosition={buttonPosition}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
