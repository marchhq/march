import MeetingPage from "@/src/components/meetings/MeetingsPage"
import generateMetadataHelper from "@/src/utils/seo"

export async function generateMetadata({
  params,
}: {
  params: { meetingId: string }
}) {
  const id = params.meetingId
  const path = `/space/meetings/${id}`
  const title = `Meetings`

  return generateMetadataHelper({
    path,
    title,
  })
}

export default function MeetingsPage({
  params,
}: {
  params: {
    meetingId?: string
  }
}) {
  if (!params.meetingId) {
    return console.log("meetId is undefined")
  }

  return <MeetingPage meetId={params.meetingId} />
}
