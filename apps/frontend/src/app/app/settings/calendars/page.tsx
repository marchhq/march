import { Info, ShareIcon } from "lucide-react"

import { Heading } from "@/src/components/atoms/Heading"
import { SelectBox } from "@/src/components/atoms/Select"
import { GoogleColored } from "@/src/lib/icons/GoogleColored"

const Calendars = (): JSX.Element => {
  return (
    <div className="flex min-h-screen items-center justify-center text-gray-color">
      <div className="w-full max-w-3xl">
        <div className="-ml-4 mr-4">
          <Heading label="Calendars" />
        </div>
        <div className="mt-8 space-y-6">
          <h1 className="font-semibold">Default Calendar</h1>
          <p>
            Events and availabilities will be created on this calendar by
            default. You can also change this in the left-hand calendar list
          </p>
          <div>
            <SelectBox
              placeholder="oliursahin@gmail.com"
              item="oliursahin@gmail.com"
            />
          </div>
          <div className="border-t border-gray-color"></div>
        </div>
        <div className="space-y-8">
          <h1 className="mt-8 font-semibold">Calendar accounts</h1>
          <div className="flex items-center justify-between gap-4 rounded-md p-5">
            <div className="flex items-center gap-4">
              <GoogleColored />
              <p>Add Google Calendar account</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="flex cursor-pointer items-center font-semibold hover:text-gray-100">
                Learn more
                <ShareIcon className="ml-2" size={16} />
              </p>
              <button className="rounded-md border border-gray-color p-1 text-sm hover:text-gray-100">
                Connect
              </button>
            </div>
          </div>
          <p>
            Per-calendar settings of connected accounts are configured by
            selecting them in the left-hand calendar list.
          </p>
          <div className="rounded-md p-5">
            <div className="flex items-center justify-start space-x-4">
              <div className="flex items-center gap-4">
                <GoogleColored />
                <p>Google Calendar</p>
              </div>
              <p className="flex items-center text-sm">
                Primary account
                <Info size={20} className="ml-2 mt-0.5" />
              </p>
            </div>
            <div className="my-4 border-t border-gray-color"></div>
            <p className="ml-8 text-sm font-medium">oliursahin@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendars
