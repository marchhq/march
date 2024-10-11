"use client"

import { Icon } from "@iconify-icon/react"

import { InboxAddItem } from "@/src/components/Inbox/InboxAddItem"
import { InboxExpandedItem } from "@/src/components/Inbox/InboxExpandedItem"
import { InboxItems } from "@/src/components/Inbox/InboxItems"
import useInboxStore from "@/src/lib/store/inbox.store"
import classNames from "@/src/utils/classNames"

export const InboxPage: React.FC = () => {
  const { selectedItem } = useInboxStore()
  return (
    <div className="flex h-full gap-8">
      <div
        className={classNames(
          "flex h-full max-w-[800px] flex-col gap-8 text-sm",
          selectedItem ? "w-1/2" : "w-full"
        )}
      >
        <header className="flex items-center gap-4 text-foreground">
          <Icon icon="hugeicons:inbox" className="text-[38px]" />
          <h1 className="text-2xl font-semibold">Inbox</h1>
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
