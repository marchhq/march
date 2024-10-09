export interface Item {
  _id: string
  title: string
  source: string
  type: string
  description: string
  dueDate: string
  isOverdue: boolean
  metadata: {
    url: string
  }
  isCompleted: boolean
  uuid: string
}

export interface Items {
  todayItems: Item[]
  overdueItems: Item[]
}
