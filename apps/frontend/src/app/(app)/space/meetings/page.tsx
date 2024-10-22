import { Metadata } from "next"

import InitialMeetings from "@/src/components/meetings/InitialMeet"
import generateMetadataHelper from "@/src/utils/seo"

export const metadata: Metadata = generateMetadataHelper({
  path: "/space/meetings",
  title: "Meetings",
  description: "engineered for makers",
})

const Meetings: React.FC = () => {
  return <InitialMeetings />
}

export default Meetings
