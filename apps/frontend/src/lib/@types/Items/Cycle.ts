export interface CycleItem {
  cycle: {
    startsAt: string | null
    endsAt: string | null
  }
  _id: string
  title: string
  type: string
  source: string
  description: string
  dueDate: Date | null
  status: string
  spaces: string[]
  blocks: string[]
  labels: string[]
  metadata?: {
    url?: string
    favicon?: string
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

export interface CycleState {
  inbox: {
    items: CycleItem[]
    isLoading: boolean
    error: string | null
  }
  today: {
    items: CycleItem[]
    isLoading: boolean
    error: string | null
  }
  thisWeek: {
    items: CycleItem[]
    startDate: string | null
    endDate: string | null
    isLoading: boolean
    error: string | null
  }
  items: CycleItem[]
  isLoading: boolean
  error: string | null
}

export interface CycleItemStore {
  items: CycleItem[]
  currentItem: CycleItem | null
  isLoading: boolean
  error: string | null
  setCurrentItem: (item: CycleItem | null) => void
  fetchInbox: (session: string) => Promise<void>
  fetchByDate: (session: string, date: string) => Promise<void>
  fetchOverdue: (session: string, date: string) => Promise<void>
  fetchThisWeek: (
    session: string,
    startDate: string,
    endDate: string
  ) => Promise<void>
  fetchFavorites: (session: string) => Promise<void>
  fetchItem: (session: string, id: string) => Promise<void>
  fetchItemByDate: (session: string, date: string) => Promise<void>
  createItem: (
    session: string,
    item: Partial<CycleItem>
  ) => Promise<CycleItem | undefined>
  updateItem: (
    session: string,
    updates: Partial<CycleItem>,
    id: string
  ) => Promise<void>
  deleteItem: (session: string, id: string) => Promise<void>
}

export interface CreateItemResponse {
  item: CycleItem
}
