"use client"

import { ItemAdd } from "@/src/components/atoms/ItemAdd"
import { ItemExpandModal } from "@/src/components/atoms/ItemExpandModal"
import { InboxItems } from "@/src/components/Inbox/InboxItems"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import classNames from "@/src/utils/classNames"

export const InboxPage: React.FC = () => {
  const { inbox, currentItem } = useCycleItemStore()
  const { items } = inbox
  const totalItems = items.length

  return (
    <div className="flex h-full flex-1 gap-8 overflow-y-auto">
      <div
        className={classNames(
          "flex size-full max-w-[800px] flex-col gap-5 text-sm",
          currentItem && "w-1/2"
        )}
      >
        <header className="flex flex-col gap-4 pl-5 text-foreground">
          <div className="flex gap-4 text-sm text-secondary-foreground">
            <span className="flex items-center">all unorganised items</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <h1 className="font-semibold">inbox</h1>
            <span className="text-secondary-foreground">{totalItems}</span>
          </div>
        </header>
        <div className="flex flex-col gap-5">
          <ItemAdd />
          <InboxItems />
        </div>
      </div>
      <ItemExpandModal />
    </div>
  )
}
