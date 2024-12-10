import Details from "./details"

interface NoteDetailsProps {
  createdAt: string
  updatedAt?: string
  formatDateHeader: (date: string) => string
  fromNow?: (date: string) => string
}

const NoteDetails: React.FC<NoteDetailsProps> = ({
  createdAt,
  formatDateHeader,
}) => {
  return (
    <Details>
      <p className="flex items-center gap-2">
        Note{" "}
        <span className="size-[3px] rounded-full bg-secondary-foreground"></span>{" "}
        {formatDateHeader(createdAt)}
      </p>
    </Details>
  )
}

export default NoteDetails
