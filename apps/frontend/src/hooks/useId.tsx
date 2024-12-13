import { useCallback, useEffect, useState } from "react"

import { useSpace } from "./useSpace"
import useBlockStore from "../lib/store/block.store"

export const useId = (session: string) => {
  const { spaces } = useSpace() || { spaces: [] }
  const { blocks, blockId, fetchBlocks, createBlock } = useBlockStore()
  const [spaceId, setSpaceId] = useState<string | null>(null)

  const loadSpaceAndBlock = useCallback(async () => {
    try {
      const meetSpace = spaces.find(
        (space) => space.name.toLowerCase() === "meetings"
      )
      if (meetSpace) {
        const spaceId = meetSpace._id
        setSpaceId(spaceId)
        const result = await fetchBlocks(session, spaceId)
        if (result?.noBlocks) {
          await createBlock(session, spaceId)
        }
      } else {
        throw new Error("meeting space not found")
      }
    } catch (e) {
      console.error(e)
    }
  }, [spaces, session, fetchBlocks, createBlock])

  // Update spaceId when blockId changes
  useEffect(() => {
    if (blockId) {
      const block = blocks.find((block) => block._id === blockId)
      if (block) {
        setSpaceId(block.space)
      }
    }
  }, [blockId, blocks])

  // Initial load
  useEffect(() => {
    loadSpaceAndBlock()
  }, [loadSpaceAndBlock])

  return { blockId, spaceId }
}
