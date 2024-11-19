import Details from "./details"

interface NoteDetailsProps {
  createdAt: string
  updatedAt: string
  formatDateHeader: (date: string) => string
  fromNow: (date: string) => string
}

const NoteDetails: React.FC<NoteDetailsProps> = ({
  createdAt,
  updatedAt,
  formatDateHeader,
  fromNow,
}) => {
  return (
    <Details>
      <p className="flex items-center">{formatDateHeader(createdAt)}.</p>
      <p className="text-xs">edited {fromNow(updatedAt)}.</p>
    </Details>
  )
}

export default NoteDetails
