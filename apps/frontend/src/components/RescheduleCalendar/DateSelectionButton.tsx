// Reusable Button Component for Date Selection
export default function DateSelectionButton({
  label,
  icon: Icon,
  formattedDate,
  onClick,
}: {
  label: string
  icon: React.ElementType
  formattedDate: string
  onClick: () => void
}) {
  return (
    <button
      className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg p-2 hover:bg-secondary-foreground hover:text-primary"
      onClick={onClick}
    >
      <span className="flex items-center gap-2">
        <Icon size={24} /> {label}
      </span>
      <span className="text-sm">{formattedDate}</span>
    </button>
  )
}
