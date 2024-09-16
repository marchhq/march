import Link from "next/link"

import CalendarAuth from "@/src/components/atoms/CalendarAuth"
import CalendarList from "@/src/components/atoms/CalendarList"
import { GoogleCalendar } from "@/src/lib/icons/Calendar"

const CalendarConnect = (): JSX.Element => {
  return (
    <div className="flex min-h-full flex-col items-center justify-center p-4 text-center text-gray-color">
      <div className="mt-24 flex flex-col items-center">
        <GoogleCalendar />
        <h1 className="mt-10 text-2xl font-semibold">Connect Your Calendar</h1>
      </div>
      <div className="my-16">
        <CalendarList />
      </div>
      <div className="my-14">
        <CalendarAuth />
      </div>
      <div>
        <Link href={"/stack"}>
          <button className="hover:text-gray-900">
            I&apos;ll do this later
          </button>
        </Link>
      </div>
    </div>
  )
}

export default CalendarConnect
