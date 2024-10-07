import MeetingPage from "@/src/components/meetings/MeetingsPage"

export default function MeetingsPage({ params }: {
  params: {
    meetingId?: string
  }
}) {
  if (!params.meetingId) {
    console.log("meetId is undefined");
    return <div>Error: Meeting ID is missing</div>;
  }

  return (
    <MeetingPage meetId={params.meetingId} />
  )
}
