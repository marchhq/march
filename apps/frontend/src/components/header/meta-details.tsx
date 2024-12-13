import Details from "./details"

interface NoteDetailsProps {
  url?: string
  duration: string
}

const MetaDetails: React.FC<NoteDetailsProps> = ({ url, duration }) => {
  return (
    <Details>
      <a href={url} target="_blank" className="flex items-center gap-2">
        <span>{url}</span>, {duration}
      </a>
    </Details>
  )
}

export default MetaDetails
