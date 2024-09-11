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
        className="w-full p-2 flex gap-4 justify-between items-center hover:bg-primary-foreground hover:text-primary rounded-lg cursor-pointer"
        onClick={onClick}
      >
        <span className="flex gap-2 items-center">
          <Icon size={24} /> {label}
        </span>
        <span className="text-sm">

        {formattedDate}
        </span>
      </button>
    )
  }