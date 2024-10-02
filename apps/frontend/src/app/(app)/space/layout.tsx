"use client"

import React, { useEffect, useState, useCallback } from "react"

import { usePathname } from "next/navigation"

import SecondSidebar from "@/src/components/SecondSidebar"
import SidebarItem from "@/src/components/SidebarItem"
import { useAuth } from "@/src/contexts/AuthContext"
import { redirectNote } from "@/src/lib/server/actions/redirectNote"
import useNotesStore from "@/src/lib/store/notes.store"
import { useSpace } from "@/src/hooks/useSpace"

interface Props {
  children: React.ReactNode
}

const navLinkClassName =
  "flex items-center gap-2 text-secondary-foreground cursor-pointer hover-text"

const SpaceLayout: React.FC<Props> = ({ children }) => {
  const pathname = usePathname()

  const { session } = useAuth()

  const [loading, setLoading] = useState(false)
  const [latestNoteId, setLatestNoteId] = useState<string>("")

  const { getLatestNote, addNote } = useNotesStore()

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

  /*  const items = [
      <div key={"notesdiv"}>
        {latestNoteId ? (
          latestNoteId !== "" ? (
            <SidebarItem
              href={`space/notes/${latestNoteId}`}
              key={"notes"}
              name="Notes"
              isActive={pathname.includes("/space/notes/")}
            />
          ) : !loading ? (
            <button onClick={addFirstNote} className={navLinkClassName}>
              <span className="truncate">Notes</span>
            </button>
          ) : (
            <div className={navLinkClassName}>
              <p>loading...</p>
            </div>
          )
        ) : (
          <span className={navLinkClassName}>Notes</span>
        )}
      </div>,
  
      <SidebarItem
        href={"space/meeting"}
        key={"meeting"}
        name="Meetings"
        isActive={pathname.includes("/space/meetings")}
      />,
    ]
  */

  const { spaces } = useSpace() || { spaces: [] };

  const constructPath = (spaceName) => {
    return `space/${spaceName.toLowerCase().replace(/\s+/g, '-')}`
  }

  const items = spaces.map(space => {
    const path = constructPath(space.name);
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
