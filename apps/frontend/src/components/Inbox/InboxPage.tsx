import { Icon } from "@iconify-icon/react"

import { InboxAddItem } from "@/src/components/Inbox/InboxAddItem"
import { InboxItems } from "@/src/components/Inbox/InboxItems"

export const InboxPage: React.FC = () => {
  return (
    <div className="h-full max-w-[800px]">
      <div className="flex flex-col h-full gap-8 text-sm">
        <header className="flex items-center gap-4 text-foreground">
          <Icon icon="hugeicons:inbox" className="text-[38px]" />
          <h1 className="text-2xl font-semibold">Inbox</h1>
        </header>
        <div className="flex flex-col h-full pb-16 gap-4">
          <InboxAddItem />
          <InboxItems />
        </div>
      </div>
    </div>
  )
}
