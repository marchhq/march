export const DynamicDate = (): JSX.Element => {
  const today = new Date()
  const day = today.getDate()

  return (
    <div
      className={
        "flex justify-center min-w-6 w-full border-2 rounded-md py-0.5 px-1 text-xs font-medium"
      }
    >
      {day}
    </div>

  )
}
