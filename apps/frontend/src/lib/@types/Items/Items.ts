export interface Item {
  _id: string
  title: string
  icon: string
  cover_image: string
  type: string
  source: string
  description: string
  cycle: {
    startsAt: string | null
    endsAt: string | null
  }
  dueDate: string
  status: string
  spaces: string[]
  blocks: string[]
  user: string
  labels: string[]
  metadata?: {
    url?: string
    favicon?: string
  }
  isFavorite: boolean
  isCompleted: boolean
  isArchived: boolean
  isDeleted: boolean
  uuid: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ItemResponse {
  items: Item[]
}

export interface ItemCreateResponse {
  response: Item
}

export interface SearchResponse {
  response: Item[]
}

export interface ItemStoreType {
  items: Item[]
  selectedItem: Item | null
  setSelectedItem: (selectedItem: Item | null) => void
  isFetched: boolean
  setIsFetched: (isFetched: boolean) => void
  fetchItems: (session: string, filter: string) => Promise<void>
  setItems: (items: Item[]) => void
  addItem: (
    session: string,
    dueDate: string,
    title: string,
    status: string,
    description?: string
  ) => Promise<void>
  updateItemStatus: (itemId: string, newStatus: string) => void
  mutateItem: (
    session: string,
    itemId: string,
    status: string,
    title?: string,
    description?: string,
    isDeleted?: boolean
  ) => Promise<void>
  updateItem: (session: string, editedItem: Item, id: string) => void
}

export interface MutateItem {
  id: string
  data: Partial<Item>
}
