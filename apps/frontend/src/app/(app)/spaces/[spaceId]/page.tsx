import { notFound, redirect } from "next/navigation"

import { getSession } from "@/src/lib/server/actions/sessions"
import useBlockStore from "@/src/lib/store/block.store"
import useSpaceStore from "@/src/lib/store/space.store"

interface SpacePageProps {
  params: { spaceId: string }
}

export default async function SpacePage({ params }: SpacePageProps) {
  const session = await getSession()

  const { spaces, fetchSpaces } = useSpaceStore.getState()

  if (spaces.length === 0) {
    await fetchSpaces(session)
  }

  const { spaces: updatedSpaces } = useSpaceStore.getState()

  const space = updatedSpaces.find((space) => space._id === params.spaceId)
  if (!space) return notFound()

  const { fetchBlocks, createBlock } = useBlockStore.getState()

  const result = await fetchBlocks(session, params.spaceId)

  if (result?.noBlocks) {
    await createBlock(session, params.spaceId)
  }

  const { blockId: currentBlockId } = useBlockStore.getState()

  if (!currentBlockId) {
    return notFound()
  }

  const redirectUrl = `/spaces/${params.spaceId}/blocks/${currentBlockId}/items`

  return redirect(redirectUrl)
}
