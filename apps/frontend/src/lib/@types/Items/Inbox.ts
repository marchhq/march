export interface InboxStoreType {
  inboxItems: InboxItem[]
  todayInboxItems: TodayInboxItem[]
  overdueInboxItems: OverdueInboxItem[]
  isFetched: boolean
  setIsFetched: (isFetched: boolean) => void
  fetchInboxData: (session: string) => Promise<InboxItem[]>
  fetchTodayInboxData: (session: string) => Promise<TodayInboxItem[]>
  fetchOverdueInboxData: (session: string) => Promise<OverdueInboxItem[]>
  moveItemToDate: (
    session: string,
    id: string | undefined,
    date: Date | undefined
  ) => Promise<InboxItem[]>
  addItem: (
    session: string,
    title: string,
    description: string
  ) => Promise<InboxItem | null>
  setTodayInboxItems: (todayInboxItems: TodayInboxItem[]) => void
  setOverdueInboxItems: (overdueInboxItems: OverdueInboxItem[]) => void
  updateItem: (editedItem: InboxItem, id: string) => void
}

export interface InboxItem {
  uuid: string
  title?: string
  type?: string
  description?: string
  effort?: string
  dueDate?: Date
  _id?: string
  metadata?: any
  createdAt?: Date
  updatedAt?: Date
  pages?: string[]
  user?: string
  isCompleted?: boolean
  isArchived?: boolean
  isDeleted?: boolean
}

export interface TodayInboxItem {
  uuid: string
  title: string
  type: string
  date: Date
  url: string
  metadata: any
  id: string
  createdAt: Date
  updatedAt: Date
  pages: string[]
  users: string
  isArchived: boolean
  isDeleted: boolean
}

export interface OverdueInboxItem {
  uuid: string
  title: string
  type: string
  description: string
  effort: string
  dueDate: Date
  id: string
  metadata: any
  createdAt: Date
  updatedAt: Date
  pages: string[]
  user: string
  isArchived: boolean
  isDeleted: boolean
  isCompleted: boolean
}

export interface InboxItemCreateResponse {
  item: InboxItem
}
