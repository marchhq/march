import Link from "next/link"

import { TimeZoneOnboard } from "@/src/components/atoms/TimeZone"

const Timezone = (): JSX.Element => {
  return (
    <div className="flex min-h-full flex-col items-center justify-center p-4 text-center text-gray-color">
      <div className="mt-24 flex flex-col items-center">
        <h1 className="mt-10 text-2xl font-semibold">You&apos;re Good to Go</h1>
      </div>
      <div className="my-16 w-full max-w-4xl px-4">
        <TimeZoneOnboard />
      </div>
      <div className="mt-8 flex w-full max-w-xs flex-col items-center">
        <Link href={"/app/today"}>
          <button className="flex w-60 items-center justify-center gap-x-6 rounded-2xl border border-button-stroke bg-transparent p-6 font-semibold text-black">
            Open march
          </button>
        </Link>
        <button className="mt-12 hover:text-gray-900">having trouble?</button>
      </div>
    </div>
  )
}

export default Timezone
