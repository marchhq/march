
export interface Block {
  _id: string
  name: string
  data: any
  user: string
}

export interface FetchBlocksResult {
  blocks?: Block[]
  noBlocks?: true
}

export interface BlockState {
  blocks: Block[]
  blockId: string | null
  isLoading: boolean
  error: string | null
  fetchBlocks: (
    session: string | Promise<string>,
    spaceId: string
  ) => Promise<FetchBlocksResult | void>
  createBlock: (
    session: string | Promise<string>,
    array: string
  ) => Promise<void>
}