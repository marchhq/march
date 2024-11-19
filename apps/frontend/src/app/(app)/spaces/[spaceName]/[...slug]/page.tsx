import { Metadata } from "next"

import { notFound } from "next/navigation"

import MeetingPage from "@/src/components/meetings/MeetingsPage"
import NotesPage from "@/src/components/Notes/NotesPage"
import generateMetadataHelper from "@/src/utils/seo"

interface SpaceSlugPageProps {
  params: {
    spaceName: string
    slug: string[]
  }
}

export async function generateMetadata({
  params,
}: SpaceSlugPageProps): Promise<Metadata> {
  const { spaceName, slug } = params
  const itemId = slug[0]

  switch (spaceName) {
    case "notes":
      return generateMetadataHelper({
        path: `/spaces/notes/${itemId}`,
        title: "Notes",
      })
    case "meetings":
      return generateMetadataHelper({
        path: `/spaces/meetings/${itemId}`,
        title: "Meetings",
      })
    case "reading-list":
      return generateMetadataHelper({
        path: `/spaces/reading-list`,
        title: "Reading List",
      })
    default:
      return notFound()
  }
}

export default function SpaceSlugPage({ params }: SpaceSlugPageProps) {
  const { spaceName, slug } = params

  if (slug.length === 0) {
    return notFound()
  }

  const itemId = slug[0]
  //const subRoute = slug[1]

  switch (spaceName) {
    case "meetings":
      return <MeetingPage meetId={itemId} />
    case "notes":
      return <NotesPage noteId={itemId} />
    default:
      return notFound()
  }
}
