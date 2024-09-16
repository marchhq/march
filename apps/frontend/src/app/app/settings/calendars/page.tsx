import { Heading } from "@/src/components/atoms/Heading"
import { SelectBox } from "@/src/components/atoms/Select"

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
      </div>

      <div>
        <h1 className="font-semibold text-black">Calendar accounts</h1>
        <div></div>
      </div>
    </div>
  )
}

export default Calendars
