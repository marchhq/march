"use client"

import React, { useEffect, useState } from "react"

import EachMeet from "@/src/components/atoms/EachMeet"
import TextEditor from "@/src/components/atoms/Editor"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/src/components/atoms/Resizable"
import { useAuth } from "@/src/contexts/AuthContext"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { type Meet } from "@/src/lib/@types/Items/Meet"
import useMeetsStore from "@/src/lib/store/meets.store"

const MeetingPage: React.FC = () => {
  const { session } = useAuth()

  const { fetchMeets, meets } = useMeetsStore()

  useEffect(() => {
    void fetchMeets(session)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [meet, setMeet] = React.useState<Meet | null>(null)

  const [title, setTitle] = useState<string>("Meeting with Persona")
  const [content, setContent] = useState<string>("")

  const editor = useEditorHook({ content, setContent })

  if (meet === null) {
    return null
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={75} minSize={40}>
        <div className="h-full overflow-y-auto overflow-x-hidden rounded-xl border border-white/10 bg-white/10 px-8 py-6 shadow-lg backdrop-blur-lg">
          <div className="mt-4 px-3">
            <div>
              <div className="flex items-center gap-x-2 text-sm text-zinc-300">
                <div className="size-4 rounded-full border border-white/30 bg-white/10" />
                {/* <span>{meet.metadata.start.dateTime}</span> */}
                <div className="size-1 rounded-full bg-zinc-300" />
                {/* <span>{meet.time}</span> */}
              </div>

              <input
                type="text"
                name="title"
                value={title}
                disabled={meets.length === 0}
                onChange={(e) => {
                  setTitle(e.target.value)
                }}
                className="mb-10 mt-5 w-full bg-transparent text-2xl font-semibold outline-none focus:outline-none dark:text-zinc-200"
              />
              <TextEditor editor={editor} />
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25} minSize={25}>
        <div className="h-full overflow-auto rounded-xl border border-white/10 bg-white/10 px-2 py-5 shadow-lg backdrop-blur-lg">
          <div className="px-3 font-semibold text-zinc-300">Upcoming</div>
          <div className="mt-12 flex flex-col gap-y-2 px-3">
            {meets.map((m) => (
              <EachMeet
                key={meet.title}
                isActive={meet?.uuid === m.uuid}
                setMeet={setMeet}
                meet={m}
              />
            ))}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default MeetingPage
