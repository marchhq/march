import Details from "./details"
import { Link as LinkIcon } from "@/src/lib/icons/Link"

interface MeetDetailsProps {
  startDateTime?: string | null
  endDateTime?: string | null
  hangoutLink?: string | null
  formatMeetDate: (date: Date) => string
  formatMeetTime: (date: Date) => string
}

const MeetDetails: React.FC<MeetDetailsProps> = ({
  startDateTime,
  endDateTime,
  hangoutLink,
  formatMeetDate,
  formatMeetTime,
}) => {
  return (
    <Details>
      <p>
        {startDateTime
          ? formatMeetDate(new Date(startDateTime))
          : "Date not available"}
        .
      </p>
      <p>
        {startDateTime && endDateTime
          ? `${formatMeetTime(new Date(startDateTime))} - ${formatMeetTime(new Date(endDateTime))}`
          : "Time not available"}
      </p>
      {hangoutLink && (
        <a
          href={hangoutLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-md px-4 text-secondary-foreground"
        >
          <span>
            <LinkIcon />
          </span>
          {hangoutLink}
        </a>
      )}
    </Details>
  )
}

export default MeetDetails
