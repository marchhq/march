import { Metadata } from "next"

import { notFound } from "next/navigation"

import InitialMeetings from "@/src/components/meetings/InitialMeet"
import NotesPage from "@/src/components/Notes/InitialNotes"
import ReadingListComponent from "@/src/components/Reading/ReadingListComponent"
import generateMetadataHelper from "@/src/utils/seo"

interface SpacePageProps {
  params: {
    spaceName: string
  }
}

export async function generateMetadata({
  params,
}: SpacePageProps): Promise<Metadata> {
  const { spaceName } = params

  switch (spaceName) {
    case "meetings":
      return generateMetadataHelper({
        path: `/space/meetings`,
        title: "Meetings",
        description: "engineered for makers",
      })
    case "reading-list":
      return generateMetadataHelper({
        path: `/space/reading-list`,
        title: "Reading List",
        description: "engineered for makers",
      })
    case "notes":
      return generateMetadataHelper({
        path: `/space/notes`,
        title: "Notes",
        description: "engineered for makers",
      })
    default:
      return notFound()
  }
}

export default function SpacePage({ params }: SpacePageProps) {
  const { spaceName } = params

  switch (spaceName) {
    case "meetings":
      return <InitialMeetings />
    case "reading-list":
      return <ReadingListComponent />
    case "notes":
      return <NotesPage />
    default:
      return notFound()
  }
}
