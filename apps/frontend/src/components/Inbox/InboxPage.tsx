"use client"

import { Icon } from "@iconify-icon/react"

import { InboxAddItem } from "@/src/components/Inbox/InboxAddItem"
import { InboxItems } from "@/src/components/Inbox/InboxItems"
import { InboxExpandedItem } from "@/src/components/Inbox/InboxExpandedItem"

import useInboxStore from "@/src/lib/store/inbox.store"
import classNames from "@/src/utils/classNames"

export const InboxPage: React.FC = () => {
  const { selectedItem } = useInboxStore()
  return (
    <div className="h-full flex gap-8">
      <div
        className={classNames(
          "flex flex-col h-full max-w-[800px] gap-8 text-sm",
          selectedItem ? "w-1/2" : "w-full"
        )}
      >
        <header className="flex items-center gap-4 text-foreground">
          <Icon icon="hugeicons:inbox" className="text-[38px]" />
          <h1 className="text-2xl font-semibold">Inbox</h1>
        </header>
        <div className="flex flex-col h-full pb-16 gap-4">
          <InboxAddItem />
          <InboxItems />
        </div>
      </div>
      <InboxExpandedItem />
    </div>
  )
}
