export interface NotesStoreType {
  notes: Note[]
  spaceId: string | null
  blockId: string | null
  latestNote: Note | null
  isFetched: boolean
  setIsFetched: (isFetched: boolean) => void
  fetchNotes: (
    session: string,
    spaceId: string,
    blockId: string
  ) => Promise<Note[]>
  setNotes: (notes: Note[]) => void
  addNote: (
    session: string,
    title: string,
    content: string
  ) => Promise<Note | null>
  updateNote: (note: Note) => void
  saveNote: (session: string, note: Note) => Promise<void>
  deleteNote: (session: string, note: Note) => void
}

export interface Note {
  _id: string
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
  items: Note[]
}

export interface NoteCreateResponse {
  item: Note
}
