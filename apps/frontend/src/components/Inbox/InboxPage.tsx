// "use client"

// import { InboxAddItem } from "@/src/components/Inbox/InboxAddItem"
// import { InboxExpandedItem } from "@/src/components/Inbox/InboxExpandedItem"
// import { InboxItems } from "@/src/components/Inbox/InboxItems"
// import { useCycleItemStore } from "@/src/lib/store/cycle.store"
// import classNames from "@/src/utils/classNames"

// export const InboxPage: React.FC = () => {
//   const { inbox, currentItem } = useCycleItemStore()
//   const { items } = inbox
//   const totalItems = items.length

//   return (
//     <div className="flex h-full flex-1 gap-8">
//       <div
//         className={classNames(
//           "flex size-full max-w-[800px] flex-col gap-5 text-sm",
//           currentItem && "w-1/2"
//         )}
//       >
//         <header className="flex flex-col gap-4 pl-5 text-foreground">
//           <div className="flex gap-4 text-sm text-secondary-foreground">
//             <span className="flex items-center">all unorganised items</span>
//           </div>
//           <div className="flex items-center gap-2 text-sm">
//             <h1 className="font-semibold">inbox</h1>
//             <p className="text-secondary-foreground">{totalItems}</p>
//           </div>
//         </header>
//         <div className="flex flex-col gap-10">
//           <InboxAddItem />
//           <InboxItems />
//         </div>
//       </div>
//       <InboxExpandedItem />
//     </div>
//   )
// }

"use client"

import { useEffect } from "react"

import { InboxAddItem } from "./InboxAddItem"
import { InboxExpandedItem } from "./InboxExpandedItem"
import { InboxItems } from "./InboxItems"
import { useWebSocket } from "@/src/hooks/useWebSocket"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import classNames from "@/src/utils/classNames"

export const InboxPage: React.FC = () => {
  const { inbox, currentItem } = useCycleItemStore()
  const { items } = inbox
  const totalItems = items.length
  const { isConnected } = useWebSocket() // Add WebSocket hook

  return (
    <div className="flex h-full flex-1 gap-8">
      <div
        className={classNames(
          "flex size-full max-w-[800px] flex-col gap-5 text-sm",
          currentItem && "w-1/2"
        )}
      >
        <header className="flex flex-col gap-4 pl-5 text-foreground">
          <div className="flex gap-4 text-sm text-secondary-foreground">
            <span className="flex items-center">all unorganised items</span>
            {/* Optional: Add WebSocket connection status */}
            <span
              className={`text-xs ${isConnected ? "text-green-500" : "text-red-500"}`}
            >
              {isConnected ? "● connected" : "● disconnected"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <h1 className="font-semibold">inbox</h1>
            <p className="text-secondary-foreground">{totalItems}</p>
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
