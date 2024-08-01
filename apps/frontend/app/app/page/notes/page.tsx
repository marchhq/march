"use client";

import React from "react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/atoms/Resizable"
import PageSection from "@/components/PageSection"
import { Notepad } from "@phosphor-icons/react"

const NotesPage: React.FC = () => {
  const notes = [1, 2, 3, 4]

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={75} minSize={40}>
        <div className="h-full overflow-auto rounded-xl border border-white/10 bg-white/10 px-6 py-5 shadow-lg backdrop-blur-lg">
          <div className="px-3 font-semibold text-zinc-300">Notes</div>
          <div className="mt-12 px-3">
            <PageSection />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel minSize={25}>
        <div className="h-full overflow-auto rounded-xl border border-white/10 bg-white/10 p-5 shadow-lg backdrop-blur-lg">
          <div className="px-3 font-semibold text-zinc-300">Notes</div>
          <div className="mt-12 flex flex-col gap-y-6">
            {notes.map((note) => (
              <div key={note}>
                <div className="flex items-center justify-start gap-x-4 text-zinc-300">
                  <Notepad size={24} weight="duotone" />
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing el</p>
                </div>
                <p className="mt-1 text-zinc-500 text-xs">Edited 2 minutes ago.</p>
              </div>
            ))}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default NotesPage
