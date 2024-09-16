import Link from "next/link"

import { TimeZoneOnboard } from "@/src/components/atoms/TimeZone"

const Timezone = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4 text-center text-gray-color">
      <div className="flex flex-col items-center mt-24">
        <h1 className="text-2xl font-semibold mt-10">You&apos;re Good to Go</h1>
      </div>
      <div className="my-16 w-full max-w-4xl px-4">
        <TimeZoneOnboard />
      </div>
      <div className="mt-8 w-full max-w-xs flex flex-col items-center">
        <Link href={"/app/today"}>
          <button className="flex w-60 items-center justify-center gap-x-6 rounded-2xl border border-button-stroke bg-transparent p-6 font-semibold text-black">
            Open march
          </button>
        </Link>
        <button className="hover:text-gray-900 mt-12">having trouble?</button>
      </div>
    </div>
  )
}

export default Timezone
