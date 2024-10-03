interface Props {
  selectedDate: Date
}

export const DynamicDate = ({ selectedDate }: Props): JSX.Element => {
  const day = String(selectedDate.getDate()).padStart(2, '0');

  return (
    <div
      className={
        "flex justify-center min-w-6 w-full border-2 rounded-md py-1.5 px-2 text-foreground text-sm font-medium"
      }
    >
      {day}
    </div>

  )
}
