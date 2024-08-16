export interface Note {
  id: string
  title: string
  content: string
  user: string
  uuid: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface NotesResponse {
  notes: Note[]
}

export interface NoteCreateResponse {
  note: Note
}
