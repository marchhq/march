export interface Note {
  id: string
  title: string
  description: string
  user: string
  uuid: string
  createdAt: string
  updatedAt: string
  __v: number
  isDeleted: boolean
}

export interface NotesResponse {
  notes: Note[]
}

export interface NoteCreateResponse {
  item: Note
}
