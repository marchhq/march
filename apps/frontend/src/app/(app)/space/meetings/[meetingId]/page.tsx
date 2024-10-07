import MeetingPage from "@/src/components/meetings/MeetingsPage"

export default function MeetingsPage = ({ params }: { params: string }): JSX.Element => {
  return (
    <MeetingPage meetId={params} />
  )
}
