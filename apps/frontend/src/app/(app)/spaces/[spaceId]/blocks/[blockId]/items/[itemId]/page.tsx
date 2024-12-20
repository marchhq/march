import { redirect } from "next/navigation"

import MeetingPage from "@/src/components/meetings/MeetingsPage"
import NotesPage from "@/src/components/Notes/NotesPage"
import { getSession } from "@/src/lib/server/actions/sessions"
import useSpaceStore from "@/src/lib/store/space.store"

type Params = Promise<{ spaceId: string; blockId: string; itemId: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ItemPage(props: {
  params: Params
  searchParams: SearchParams
}) {
  const params = await props.params
  const { spaceId, blockId, itemId } = params

  const session = await getSession()
  const { spaces, fetchSpaces } = useSpaceStore.getState()

  if (spaces.length === 0) {
    await fetchSpaces(session)
  }

  const { spaces: updatedSpaces } = useSpaceStore.getState()

  const space = updatedSpaces.find((space) => space._id === spaceId)
  if (!space)
    return <div className="text-primary-foreground">no space found</div>

  switch (space.name.toLowerCase()) {
    case "notes":
      return <NotesPage noteId={itemId} spaceId={spaceId} blockId={blockId} />
    case "meetings":
      return <MeetingPage meetId={itemId} spaceId={spaceId} blockId={blockId} />
    case "reading list":
      return redirect(`/spaces/${spaceId}/${blockId}/items`)
    default:
      return <div>Cannot Find Item. Please Create one!</div>
  }
}
