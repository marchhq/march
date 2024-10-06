export interface ReadingItem {
  _id: string
  title: string
  description?: string
  metadata?: { isUrl: boolean }
}
