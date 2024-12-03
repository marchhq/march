import type { JSX } from "react"
export const DynamicDate = ({
  selectedDate,
}: {
  selectedDate: Date
}): JSX.Element => {
  const day = selectedDate.getDate()
  return (
    <div className="flex size-8 items-center justify-center rounded-md bg-[#272727] text-sm font-bold text-foreground">
      {day}
    </div>
  )
}
