import { notFound, redirect } from "next/navigation"

import MeetingPage from "@/src/components/meetings/MeetingsPage"
import NotesPage from "@/src/components/Notes/NotesPage"
import { getSession } from "@/src/lib/server/actions/sessions"
import useSpaceStore from "@/src/lib/store/space.store"

interface ItemPageProps {
  params: {
    spaceId: string
    blockId: string
    itemId: string
  }
}

export default async function ItemPage({ params }: ItemPageProps) {
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
    case "notes":
      return (
        <NotesPage
          noteId={params.itemId}
          spaceId={params.spaceId}
          blockId={params.blockId}
        />
      )
    case "meetings":
      return <MeetingPage meetId={params.itemId} />
    case "reading list":
      return redirect(`/spaces/${params.spaceId}/${params.blockId}/items`)
    default:
      return <div>Cannot Find Item. Please Create one!</div>
  }
}
