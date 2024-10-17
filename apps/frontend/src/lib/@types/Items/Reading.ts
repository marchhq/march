export interface ReadingItem {
  _id: string
  title: string
  description?: string
  type: string;
  metadata?: {
    url: string
    favicon: string
  }
}
