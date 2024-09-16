import { GoogleColored } from "@/src/lib/icons/GoogleColored"

const CalendarAuth = (): JSX.Element => {
  return (
    <button className="flex w-96 items-center justify-center gap-x-6 rounded-2xl bg-transparent p-3 font-semibold text-[#9C9C9D]">
      <GoogleColored />
      Authorize with Google
    </button>
  )
}

export default CalendarAuth
