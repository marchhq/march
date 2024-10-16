export interface CycleItem {
  cycleDate: string
  _id: string
  title: string
  type: string
  source: string
  description: string
  dueDate: string
  status: string
  spaces: string[]
  blocks: string[]
  labels: string[]
  isCompleted: boolean
  isArchived: boolean
  isDeleted: boolean
  uuid: string
}

export interface CycleItems {
  response: CycleItem[]
}

export interface CycleItemStoreTypes {
  item: CycleItem | null
  items: CycleItem[]
  isLoading: boolean
  isFetched: boolean
  fetchItems: (session: string) => Promise<void>
  createItem: (data: CycleItem, session: string) => Promise<void>
  setItem: (item: CycleItem | null) => void
  setIsFetched: (isFetched: boolean) => void
}

export interface CreateItemResponse {
  item: CycleItem
}
