export interface CycleItem {
  cycleDate: string
  _id: string
  title: string
  type: string
  source: string
  description: string
  dueDate: Date | string
  status: string
  spaces: string[]
  blocks: string[]
  labels: string[]
  metadata: {
    url: string
  }
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

/*
export interface CycleItemStore {
  items: CycleItem[]
  currentItem: CycleItem | null
  isLoading: boolean
  error: string | null
  fetchItems: (session: string, date?: string) => Promise<void>
  fetchThisWeek: (session: string) => Promise<void>
  fetchItem: (session: string, id: string) => Promise<void>
  fetchItemByDate: (session: string, date: string) => Promise<void>
  fetchBlocksBySpaceId: (session: string, spaceId: string) => Promise<string[]>
  setCurrentItem: (item: CycleItem | null) => void
  createItem: (session: string, item: Partial<CycleItem>) => Promise<void>
  updateItem: (
    session: string,
    updates: Partial<CycleItem>,
    id: string
  ) => Promise<void>
  deleteItem: (
    session: string,
    updates: Partial<CycleItem>,
    id: string
  ) => Promise<void>
}
*/

export interface CycleItemStore {
  items: CycleItem[]
  currentItem: CycleItem | null
  isLoading: boolean
  error: string | null
  fetchItems: (session: string, date?: string) => Promise<void>
  fetchThisWeek: (session: string) => Promise<void>
  fetchItem: (session: string, id: string) => Promise<void>
  fetchItemByDate: (session: string, date: string) => Promise<void>
  fetchBlocksBySpaceId: (session: string, spaceId: string) => Promise<string[]>
  setCurrentItem: (item: CycleItem | null) => void
  createItem: (session: string, item: Partial<CycleItem>) => Promise<void>
  updateItem: (
    session: string,
    updates: Partial<CycleItem>,
    id: string
  ) => Promise<void>
  deleteItem: (
    session: string,
    updates: Partial<CycleItem>,
    id: string
  ) => Promise<void>
}

export interface CreateItemResponse {
  item: CycleItem
}
