"use client"

import { Icon } from "@iconify-icon/react"

import { InboxAddItem } from "@/src/components/Inbox/InboxAddItem"
import { InboxExpandedItem } from "@/src/components/Inbox/InboxExpandedItem"
import { InboxItems } from "@/src/components/Inbox/InboxItems"
import classNames from "@/src/utils/classNames"

export const InboxPage: React.FC = () => {
  return (
    <div className="flex h-full gap-8">
      <div
        className={classNames(
          "flex size-full max-w-[800px] flex-col gap-8 text-sm z-50"
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
