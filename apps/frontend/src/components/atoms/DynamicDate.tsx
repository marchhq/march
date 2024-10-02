interface Props {
  selectedDate: Date
}

export const DynamicDate = ({ selectedDate }: Props): JSX.Element => {
  const day = selectedDate.getDate()

  return (
    <div
      className={
        "flex justify-center min-w-6 w-full border-2 rounded-md py-0.5 px-2 text-sm font-medium"
      }
    >
      {day}
    </div>

  )
}
