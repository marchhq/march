export const DynamicDate = ({ selectedDate }: { selectedDate: Date }): JSX.Element => {
  const day = selectedDate.getDate();
  return (
    <div
      className="flex justify-center items-center w-8 h-8 bg-[#272727] rounded-md text-foreground text-sm font-bold"
    >
      {day}
    </div>
  )
}
