import Link from "next/link"

import CalendarAuth from "@/src/components/atoms/CalendarAuth"
import CalendarList from "@/src/components/atoms/CalendarList"
import { Calendar } from "@/src/lib/icons/Calendar"

const CalendarConnect = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4 text-center text-gray-color">
      <div className="flex flex-col items-center mt-24">
        <Calendar />
        <h1 className="text-2xl font-semibold mt-10">Connect Your Calendar</h1>
      </div>
      <div className="my-16">
        <CalendarList />
      </div>
      <div className="my-16">
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
