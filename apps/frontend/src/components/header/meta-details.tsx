import Details from "./details"

interface NoteDetailsProps {
  url?: string | null
  duration: string
}

const MetaDetails: React.FC<NoteDetailsProps> = ({ url, duration }) => {
  return (
    <Details>
      <p className="flex items-center gap-2">
        <span className="underline">{url}</span>, {duration}
      </p>
    </Details>
  )
}

export default MetaDetails
