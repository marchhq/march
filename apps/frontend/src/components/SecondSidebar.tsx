"use client"

import React, { useEffect } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/src/contexts/AuthContext"
import classNames from "../utils/classNames"
import useNotesStore from "@/src/lib/store/notes.store"
import { redirectNote } from "@/src/lib/server/actions/redirectNote"

const navLinkClassName =
  "flex items-center gap-2 text-secondary-foreground cursor-pointer hover-text"

const Item = ({
  href,
  name,
  isActive,
}: {
  href: string
  name: string
  isActive: boolean
}) => {
  const activeClass = isActive ? "text-foreground" : ""
  return (
    <Link href={`/space/${href}`} className={navLinkClassName}>
      <span className={classNames(activeClass, "truncate")}>{name}</span>
    </Link>
  )
}

const SecondSidebar: React.FC = () => {
  const pathname = usePathname()
  const [closeToggle, setCloseToggle] = useState(false)
  const { session } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setCloseToggle(!closeToggle)
  }

  const { fetchNotes, notes, isFetched, setIsFetched, addNote } =
    useNotesStore()

  const fetchTheNotes = async (): Promise<void> => {
    await fetchNotes(session)
    setIsFetched(true)
  }

  useEffect(() => {
    void fetchTheNotes()
  }, [])

  useEffect(() => {
    if (isFetched) {
      console.log(notes)
    }
  }, [isFetched])

  const addFirstNote = async (): Promise<void> => {
    try {
      setLoading(true)
      const newNote = await addNote(session, "", "<p></p>")
      if (newNote !== null) {
        redirectNote(newNote.uuid)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-[160px] relative text-xs font-medium group">
      <button
        className="absolute right-2 top-2 text-secondary-foreground hover-text opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleClose}
      >
        {closeToggle ? "open" : "close"}
      </button>
      <div
        className={classNames(
          closeToggle ? "hidden" : "visible",
          "w-[160px] h-full flex flex-col justify-center gap-2 pr-4 bg-background"
        )}
      >
        {isFetched && (
          <>
            {notes.length > 0 ? (
              <Item
                href={`notes/${notes[0]?.uuid}`}
                name="Notes"
                isActive={pathname.includes("/space/notes/")}
              />
            ) : (
              <>
                {!loading ? (
                  <button onClick={addFirstNote} className={navLinkClassName}>
                    <span className="truncate">Notes</span>
                  </button>
                ) : (
                  <div className={navLinkClassName}>
                    <p>loading</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
        <Item
          href="meeting"
          name="Meeting"
          isActive={pathname.includes("/space/meeting/")}
        />
      </div>
    </div>
  )
}

export default SecondSidebar
