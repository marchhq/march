import { Label } from "@/src/lib/@types/Label"

export enum ReadingLabelName {
  ARCHIVE = "archive",
  LIKED = "liked",
}

export interface ReadingItem {
  _id: string
  title: string
  description?: string
  metadata?: {
    url: string
    favicon: string
  }
  labels: ReadingLabel[]
}

export interface ReadingLabel extends Label {
  name: ReadingLabelName
}
