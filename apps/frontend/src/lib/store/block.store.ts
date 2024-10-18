import { create } from "zustand"

import { BACKEND_URL } from "../constants/urls"

interface Block {
  _id: string
  name: string
  data: any
  user: string
  space: string
}

interface FetchBlocksResult {
  blocks?: Block[]
  noBlocks?: true
}

interface BlockState {
  blocks: Block[]
  blockId: string | null
  isLoading: boolean
  error: string | null
  fetchBlocks: (
    session: string,
    spaceId: string
  ) => Promise<FetchBlocksResult | void>
  createBlock: (session: string, spaceId: string) => Promise<void>
}

const useBlockStore = create<BlockState>((set, get) => ({
  blocks: [],
  blockId: null,
  isLoading: false,
  error: null,

  // Fetch existing blocks for the given space
  fetchBlocks: async (session: string, spaceId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${BACKEND_URL}/spaces/${spaceId}/blocks/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const blocks = data.blocks
        set({ blocks })

        if (blocks.length > 0) {
          set({ blockId: blocks[0]._id }) // Set the first block ID if it exists
        } else {
          // No block exists;
          return { noBlocks: true }
        }
        return data
      } else {
        set({ error: "Failed to fetch blocks." })
      }
    } catch (err) {
      set({ error: "An error occurred while fetching blocks." })
    } finally {
      set({ isLoading: false })
    }
  },

  // Create a new block if none exists
  createBlock: async (session: string, spaceId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${BACKEND_URL}/spaces/${spaceId}/blocks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        body: JSON.stringify({
          name: "New Block",
          data: {},
        }),
      })

      if (response.ok) {
        const { block } = await response.json()
        set((state) => ({
          blocks: [...state.blocks, block],
          blockId: block._id,
        }))
      } else {
        set({ error: "Failed to create a new block." })
      }
    } catch (err) {
      set({ error: "An error occurred while creating a block." })
    } finally {
      set({ isLoading: false })
    }
  },
}))

export default useBlockStore
