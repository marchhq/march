export interface ReadingItem {
  _id: string
  title: string
  type?: string
  description?: string
  status?: string
  dueDate?: Date | null
  cycle?: {
    startsAt: string | null
    endsAt: string | null
  }
  metadata?: {
    url: string
    favicon: string
  }
}
