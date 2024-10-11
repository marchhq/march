import MeetingPage from "@/src/components/meetings/MeetingsPage"

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
