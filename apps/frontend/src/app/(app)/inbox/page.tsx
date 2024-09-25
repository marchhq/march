"use client"

import React, { useState, useEffect } from "react"

import { Icon } from "@iconify-icon/react"
import { PlusIcon } from "@radix-ui/react-icons"

import { InboxTextArea } from "@/src/components/InboxTextArea"

const InboxPage: React.FC = () => {
  const [addingItem, setAddingItem] = useState(false)

  return (
    <section className="h-full overflow-auto bg-background ml-[160px] p-16 text-secondary-foreground">
      <div className="max-w-[800px]">
        <div className="flex flex-col gap-8 text-sm">
          <header className="flex items-center gap-4 text-foreground">
            <Icon icon="hugeicons:inbox" style={{ fontSize: "38px" }} />
            <h1 className="text-2xl font-semibold">Inbox</h1>
          </header>
          <div className="flex flex-col gap-4">
            {!addingItem ? (
              <button
                className="p-4 border border-border rounded-lg hover-bg"
                onClick={() => setAddingItem(true)}
              >
                <div className="flex items-center gap-2">
                  <PlusIcon />
                  <p>Click to Add an Item</p>
                </div>
              </button>
            ) : (
              <div>
                <div className="flex justify-end hover-text">
                  <button onClick={() => setAddingItem(false)}>close</button>
                </div>
                <InboxTextArea />
              </div>
            )}
            <button className="flex flex-col text-left gap-1 p-4 border border-border rounded-lg hover-bg">
              <div className="flex items-center gap-2 text-foreground">
                <Icon
                  icon="fluent:note-16-regular"
                  style={{ fontSize: "18px" }}
                />
                <p>list of the desired gtms</p>
              </div>
              <div className="ml-[18px] pl-2 text-xs">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Consequatur reprehenderit, accusamus nam similique laboriosam
                  sequi fugit eum veniam nobis itaque eaque fugiat praesentium
                  vitae minima porro. Temporibus, eligendi deserunt! Cumque!
                </p>
              </div>
            </button>
            <button className="flex flex-col text-left gap-1 p-4 border border-border rounded-lg hover-bg">
              <div className="flex items-center gap-2 text-foreground">
                <Icon icon="ri:github-fill" style={{ fontSize: "18px" }} />
                <p>Pull request #23</p>
              </div>
              <div className="ml-[18px] pl-2 text-xs">
                <p>webhooks for all exisiting integrations</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InboxPage
