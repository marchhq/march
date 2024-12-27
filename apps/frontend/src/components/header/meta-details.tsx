import { ExternalLink } from "lucide-react"

interface NoteDetailsProps {
  url?: string
  duration?: string
}

const MetaDetails: React.FC<NoteDetailsProps> = ({ url, duration }) => {
  return (
    <div className="text-sm text-secondary-foreground">
      {url || duration ? (
        <span className="flex items-center gap-2">
          {url ? (
            <>
              <ExternalLink size={16} />
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {url}
              </a>
            </>
          ) : (
            <span>no url</span>
          )}
          {url && duration && <span>,</span>}
          {duration && <span>{duration}</span>}
        </span>
      ) : (
        <span>No metadata available</span>
      )}
    </div>
  )
}

export default MetaDetails
