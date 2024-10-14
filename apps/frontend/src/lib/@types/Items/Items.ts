export interface Item {
  _id: string
  title: string
  source: string
  description: string
  dueDate: string
  status: string
  spaces: string[]
  blocks: string[]
  user: string
  labels: string[]
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
