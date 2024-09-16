import { Heading } from "@/src/components/atoms/Heading"
import { SelectBox } from "@/src/components/atoms/Select"
import { GoogleColored } from "@/src/lib/icons/GoogleColored"

const Calendars = (): JSX.Element => {
  return (
    <div className="ml-28 mt-1 max-w-xl">
      <Heading label="Calendars" />
      <div className="ml-2 mt-8 space-y-4">
        <h1 className="font-semibold text-black">Default Calendar</h1>
        <p>
          Events and availabilities will be created on this calendar by default.
          You can also change this in the left-hand calendar list
        </p>
        <div>
          <SelectBox />
        </div>
        <div className=" border-t border-gray-300"></div>
      </div>
      <div className="space-y-4">
        <h1 className="mt-8 font-semibold text-black">Calendar accounts</h1>
        <div className="flex items-center justify-start gap-4 rounded-md border border-gray-300 p-5">
          <GoogleColored />
          <p className="mr-8">Add Google Calendar account</p>
          <p className="cursor-pointer font-semibold text-black">Learn more</p>
          <button className="rounded-md border border-gray-300 p-2 text-black">
            Connect
          </button>
        </div>
        <p>
          Per-calendar settings of connected accounts are configured by
          selecting them in the left-hand calendar list.
        </p>
        <div className="rounded-md border border-gray-300 bg-gray-200 p-5">
          <div className="flex items-center justify-start gap-4">
            <GoogleColored />
            <p className="mr-8">Google Calendar</p>
            <p className="divide-y-2 divide-gray-300">Primary account</p>
          </div>
          <div className="my-4 border-t border-gray-300"></div>
          <div>
            <p className="ml-8 text-black">oliursahin@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendars
