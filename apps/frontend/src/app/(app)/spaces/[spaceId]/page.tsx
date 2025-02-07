import { notFound, redirect } from "next/navigation"

import { getSession } from "@/src/lib/server/actions/sessions"
import useBlockStore from "@/src/lib/store/block.store"
import useSpaceStore from "@/src/lib/store/space.store"

type Params = Promise<{ spaceId: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function SpacePage(props: {
  params: Params
  searchParams: SearchParams
}) {
  const params = await props.params
  const session = await getSession()

  const { spaces, fetchSpaces } = useSpaceStore.getState()
  const space = spaces.find((space) => space._id === params.spaceId)

  if (!space) {
    await fetchSpaces(session)
    const { spaces: updatedSpaces } = useSpaceStore.getState()
    const updatedSpace = updatedSpaces.find((s) => s._id === params.spaceId)
    if (!updatedSpace) return notFound()
  }

  const { blocks, blockId } = useBlockStore.getState()
  const existingBlock = blocks.find((block) => block.space === params.spaceId)

  if (blockId) {
    return redirect(`/spaces/${params.spaceId}/blocks/${blockId}/items`)
  }

  if (existingBlock) {
    return redirect(
      `/spaces/${params.spaceId}/blocks/${existingBlock._id}/items`
    )
  }

  const { fetchBlocks, createBlock } = useBlockStore.getState()
  const result = await fetchBlocks(session, params.spaceId)

  if (result?.noBlocks) {
    await createBlock(session, params.spaceId)
  }

  const { blockId: newBlockId } = useBlockStore.getState()
  if (!newBlockId) return notFound()

  return redirect(`/spaces/${params.spaceId}/blocks/${newBlockId}/items`)
}
