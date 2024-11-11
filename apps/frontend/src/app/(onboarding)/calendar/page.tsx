import { Icon } from "@iconify-icon/react"
import Link from "next/link"

import CalendarAuth from "@/src/components/atoms/CalendarAuth"
import CalendarList from "@/src/components/atoms/CalendarList"

const CalendarConnect = () => {
  return (
    <main className="flex h-full flex-col items-center justify-between">
      <div className="flex size-full flex-col items-center justify-center gap-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="font-medium">Connect Your Calendar</h1>
        </div>
        <div className="flex flex-col gap-1 text-base font-medium text-secondary-foreground">
          <CalendarList />
        </div>
        <div className="flex w-full flex-col items-center gap-2 text-base">
          <CalendarAuth />
        </div>
      </div>
      <div className="w-full text-sm text-secondary-foreground">
        <div className="text-center">
          <Link href={"/stack"}>
            <button className="hover-text">I&apos;ll do this later</button>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default CalendarConnect
