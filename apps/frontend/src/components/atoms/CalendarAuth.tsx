import Google from "@/src/lib/icons/Google"

const CalendarAuth = (): JSX.Element => {
  return (
    <button className="flex w-96 items-center justify-center gap-x-6 rounded-2xl border border-button-stroke bg-transparent p-3 font-semibold text-black">
      <Google />
      Authorize with Google
    </button>
  )
}

export default CalendarAuth
