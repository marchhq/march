import MeetingPage from "@/src/components/meetings/MeetingsPage"
import generateMetadataHelper from "@/src/utils/seo"

export async function generateMetadata(
  props: {
    params: Promise<{ meetingId: string }>
  }
) {
  const params = await props.params;
  const id = params.meetingId
  const path = `/space/meetings/${id}`
  const title = `Meetings`

  return generateMetadataHelper({
    path,
    title,
  })
}

export default async function MeetingsPage(
  props: {
    params: Promise<{
      meetingId?: string
    }>
  }
) {
  const params = await props.params;
  if (!params.meetingId) {
    return console.log("meetId is undefined")
  }

  return <MeetingPage meetId={params.meetingId} />
}
