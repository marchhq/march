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
  createdAt: string
  updatedAt: string
}

export interface CycleItems {
  response: CycleItem[]
}

export interface CycleItemStoreTypes {
  cycleItem: CycleItem | null
  cycleItems: CycleItem[]
  isLoading: boolean
  isFetched: boolean
  fetchItems: (session: string) => Promise<CycleItem[]>
  createItem: (data: Partial<CycleItem>, session: string) => Promise<void>
  mutateItem: (
    data: Partial<CycleItem>,
    session: string,
    id: string
  ) => Promise<void>
  setCycleItem: (item: CycleItem | null) => void
  setIsFetched: (isFetched: boolean) => void
}

export interface CreateItemResponse {
  item: CycleItem
}
