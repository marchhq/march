"use client"

import { Icon } from "@iconify-icon/react"
import { ListFilter } from "lucide-react"

import { InboxAddItem } from "@/src/components/Inbox/InboxAddItem"
import { InboxExpandedItem } from "@/src/components/Inbox/InboxExpandedItem"
import { InboxItems } from "@/src/components/Inbox/InboxItems"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import classNames from "@/src/utils/classNames"

export const InboxPage: React.FC = () => {
  const { inbox } = useCycleItemStore()
  const { items } = inbox
  const totalItems = items.length
  return (
    <div className="flex h-full gap-8">
      <div
        className={classNames(
          "flex h-full max-w-[800px] flex-col gap-2 text-sm",
          items ? "w-1/2" : "w-full"
        )}
      >
        <header className="flex flex-col gap-3 pl-4 text-foreground">
          <div className="flex items-center gap-3 text-secondary-foreground">
            <ListFilter size={16} />
            <h1 className="">all unorganised items</h1>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold">Inbox</h2>
            <p className="text-sm text-secondary-foreground">{totalItems}</p>
          </div>
        </header>
        <div className="flex h-full flex-col gap-4 pb-16">
          <InboxAddItem />
          <InboxItems />
        </div>
      </div>
      <InboxExpandedItem />
    </div>
  )
}
