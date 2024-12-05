import { notFound } from "next/navigation"

import InitialMeetings from "@/src/components/meetings/InitialMeet"
import InitialNotes from "@/src/components/Notes/InitialNotes"
import ReadingListComponent from "@/src/components/Reading/ReadingListComponent"
import { getSession } from "@/src/lib/server/actions/sessions"
import useReadingStore from "@/src/lib/store/reading.store"
import useSpaceStore from "@/src/lib/store/space.store"

type Params = Promise<{ spaceId: string; blockId: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ItemsListPage(props: {
  params: Params
  searchParams: SearchParams
}) {
  const params = await props.params
  const { spaceId, blockId } = params
  const session = await getSession()
  const { spaces, fetchSpaces } = useSpaceStore.getState()
  const { fetchReadingList } = useReadingStore.getState()

  if (spaces.length === 0) {
    await fetchSpaces(session)
  }

  const { spaces: updatedSpaces } = useSpaceStore.getState()

  const space = updatedSpaces.find((space) => space._id === spaceId)
  if (!space) return notFound()

  //prefetch items
  if (space.name.toLowerCase() === "reading list") {
    await fetchReadingList(session, spaceId, blockId)
  }

  switch (space.name.toLowerCase()) {
    case "reading list":
      return <ReadingListComponent spaceId={spaceId} blockId={blockId} />
    case "meetings":
      return <InitialMeetings spaceId={spaceId} blockId={blockId} />
    case "notes":
      return <InitialNotes spaceId={spaceId} blockId={blockId} />
    default:
      return notFound()
  }
}
