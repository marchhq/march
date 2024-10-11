import { Icon } from "@iconify-icon/react"
import Link from "next/link"

import CalendarAuth from "@/src/components/atoms/CalendarAuth"
import CalendarList from "@/src/components/atoms/CalendarList"

const CalendarConnect = () => {
  return (
    <main className="flex flex-col items-center justify-between h-full">
      <div className="flex flex-col items-center justify-center gap-12 size-full">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center p-2">
            <Icon icon="logos:google-calendar" className="text-[50px]" />
          </div>
          <h2 className="text-3xl font-bold">Connect Your Calendar</h2>
        </div>
        <div className="flex flex-col gap-1 text-base text-secondary-foreground font-medium">
          <CalendarList />
        </div>
        <div className="flex flex-col items-center w-full gap-2 text-base">
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
