import InitialMeetings from "@/src/components/meetings/InitialMeet"
import InitialNotes from "@/src/components/Notes/InitialNotes"
import ReadingListComponent from "@/src/components/Reading/ReadingListComponent"
import { getSession } from "@/src/lib/server/actions/sessions"
import useSpaceStore from "@/src/lib/store/space.store"

interface ItemsListProps {
  params: {
    spaceId: string
    blockId: string
  }
}

export default async function ItemsListPage({ params }: ItemsListProps) {
  const session = await getSession()
  const { spaces, fetchSpaces } = useSpaceStore.getState()

  if (spaces.length === 0) {
    await fetchSpaces(session)
  }

  const { spaces: updatedSpaces } = useSpaceStore.getState()

  const space = updatedSpaces.find((space) => space._id === params.spaceId)
  if (!space)
    return <div className="text-primary-foreground">no space found</div>

  switch (space.name.toLowerCase()) {
    case "reading list":
      return (
        <ReadingListComponent
          spaceId={params.spaceId}
          blockId={params.blockId}
        />
      )
    case "meetings":
      return (
        <InitialMeetings spaceId={params.spaceId} blockId={params.blockId} />
      )
    case "notes":
      return <InitialNotes spaceId={params.spaceId} blockId={params.blockId} />
  }
}
