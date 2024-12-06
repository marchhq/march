import { Meet } from "@/src/lib/@types/Items/Meet"

export interface MeetState {
  meet: Meet | null
  title: string
  content: string
  isSaved: boolean
  isLoading: boolean
  notFound: boolean
  closeToggle: boolean
  isInitialLoad: boolean
  isEditingTitle: boolean
}
