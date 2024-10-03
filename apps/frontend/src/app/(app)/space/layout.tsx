"use client"

import React, { useEffect, useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import SecondSidebar from "@/src/components/SecondSidebar"
import SidebarItem from "@/src/components/SidebarItem"
import { useAuth } from "@/src/contexts/AuthContext"
import { useSpace } from "@/src/hooks/useSpace"
import { redirectNote } from "@/src/lib/server/actions/redirectNote"
import useNotesStore from "@/src/lib/store/notes.store"

interface Props {
  children: React.ReactNode
}

const SpaceLayout: React.FC<Props> = ({ children }) => {
  const pathname = usePathname()
  const { session } = useAuth()
  const [loading, setLoading] = useState(false)
  const [latestNoteId, setLatestNoteId] = useState<string>("")
  const { getLatestNote, addNote } = useNotesStore()
  const { spaces } = useSpace() || { spaces: [] }

  const getNoteId = useCallback(async (): Promise<string | null> => {
    try {
      const note = await getLatestNote(session)
      if (note) {
        setLatestNoteId(note.uuid)
      }
      return note?.uuid || ""
    } catch (error) {
      console.error(error)
      return null
    }
  }, [session, getLatestNote])

  useEffect(() => {
    if (!latestNoteId) {
      getNoteId()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getNoteId])

  const addFirstNote = async (): Promise<void> => {
    try {
      setLoading(true)
      const newNote = await addNote(session, "", "<p></p>")
      if (newNote !== null) {
        setLatestNoteId(newNote.uuid)
        redirectNote(newNote.uuid)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const constructPath = (spaceName: string) => {
    return `space/${spaceName.toLowerCase().replace(/\s+/g, "-")}`
  }

  const items = spaces.map((space) => {
    const path = constructPath(space.name)
    return (
      <SidebarItem
        href={path}
        key={space._id}
        name={space.name}
        isActive={pathname.includes(path)}
      />
    )
  })

  return (
    <div className="flex h-full">
      <div className="ml-[100px] flex">
        <SecondSidebar items={items} />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default SpaceLayout
