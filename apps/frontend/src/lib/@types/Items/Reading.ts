export interface ReadingItem {
  _id: string
  title: string
  description?: string
  metadata?: {
    url: string
    favicon: string
  }
}
