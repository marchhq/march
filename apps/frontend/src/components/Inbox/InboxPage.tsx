"use client"

import { Icon } from "@iconify-icon/react"
import { ListFilter } from "lucide-react"

import { InboxAddItem } from "@/src/components/Inbox/InboxAddItem"
import { InboxExpandedItem } from "@/src/components/Inbox/InboxExpandedItem"
import { InboxItems } from "@/src/components/Inbox/InboxItems"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import classNames from "@/src/utils/classNames"
import { formatDateYear } from "@/src/utils/datetime"

export const InboxPage: React.FC = () => {
  const { inbox } = useCycleItemStore()
  const { items } = inbox
  const totalItems = items.length

  return (
    <div className="flex h-full gap-8">
      <div className="flex size-full max-w-[800px] flex-col gap-5 text-sm">
        <header className="flex flex-col gap-4 pl-5 text-foreground">
          <div className="flex gap-4 text-sm text-secondary-foreground">
            <p className="flex items-center">can we add something here?</p>
            <button className="hover-bg flex w-fit items-center gap-2 rounded-md px-1">
              <ListFilter size={16} />
              <span>all unorganised items</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold">inbox</h1>
            <p className="text-sm text-secondary-foreground">{totalItems}</p>
          </div>
        </header>
        <div className="flex flex-col gap-10">
          <InboxAddItem />
          <InboxItems />
        </div>
      </div>
      <InboxExpandedItem />
    </div>
  )
}
