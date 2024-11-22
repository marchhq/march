import { useCallback, useEffect, useState } from "react"

import { useAuth } from "../contexts/AuthContext"
import useBlockStore from "../lib/store/block.store"
import { useMeetsStore } from "../lib/store/meets.store"
import useNotesStore from "../lib/store/notes.store"
import useReadingStore from "../lib/store/reading.store"

export const useSidebarData = (spaceId: string, isCollapsed: boolean) => {
  const { session } = useAuth()
  const { blocks, blockId, createBlock, fetchBlocks } = useBlockStore()
  const { readingItems, fetchReadingList } = useReadingStore()
  const { notes, fetchNotes, setIsFetched, isFetched } = useNotesStore()
  const { meets, fetchMeets } = useMeetsStore()

  const loadBlocks = useCallback(async () => {
    try {
      const result = await fetchBlocks(session, spaceId)
      if (result?.noBlocks) {
        await createBlock(session, spaceId)
      }
    } catch (e) {
      console.error("Error loading blocks:", e)
    }
  }, [spaceId, session, fetchBlocks, createBlock])

  const loadReadingList = useCallback(async () => {
    if (blockId) {
      const currentSpaceId = blocks.find(
        (block) => block._id === blockId
      )?.space
      if (currentSpaceId) {
        await fetchReadingList(session, blockId, currentSpaceId)
      }
    }
  }, [blockId, blocks, fetchReadingList, session])

  const loadNotes = useCallback(async () => {
    try {
      await fetchNotes(session)
      setIsFetched(true)
    } catch (e) {
      setIsFetched(false)
      console.error("Error loading notes:", e)
    }
  }, [session, fetchNotes, setIsFetched])

  const loadMeets = useCallback(async () => {
    try {
      await fetchMeets(session)
    } catch (e) {
      console.error("Error loading meets:", e)
    }
  }, [fetchMeets, session])

  // Section-specific fetching
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const [isMeetsOpen, setIsMeetsOpen] = useState(false)
  const [isReadingListOpen, setIsReadingListOpen] = useState(false)

  useEffect(() => {
    if (!isCollapsed) {
      loadBlocks()
    }
  }, [isCollapsed, loadBlocks])

  useEffect(() => {
    if (!isFetched && !isCollapsed && isNotesOpen) {
      loadNotes()
    }
  }, [isFetched, isCollapsed, isNotesOpen, loadNotes])

  useEffect(() => {
    if (!isCollapsed && isMeetsOpen) {
      loadMeets()
    }
  }, [isCollapsed, isMeetsOpen, loadMeets])

  useEffect(() => {
    if (blocks.length > 0 && !isCollapsed && isReadingListOpen) {
      loadReadingList()
    }
  }, [blocks, isCollapsed, isReadingListOpen, loadReadingList])

  return {
    notes,
    meets,
    readingItems,
    setIsNotesOpen,
    setIsMeetsOpen,
    setIsReadingListOpen,
  }
}
