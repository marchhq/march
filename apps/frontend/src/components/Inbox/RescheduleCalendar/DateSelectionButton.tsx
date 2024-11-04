export default function DateSelectionButton({
  label,
  formattedDate,
  onClick,
}: {
  label: string
  formattedDate: string
  onClick: () => void
}) {
  return (
    <button
      className="hover-text flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg py-1"
      onClick={onClick}
    >
      <span>{label}</span>
      <span>{formattedDate}</span>
    </button>
  )
}
