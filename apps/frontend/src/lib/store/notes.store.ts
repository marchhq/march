import axios, { type AxiosError } from "axios"
import { create } from "zustand"

import { BACKEND_URL } from "../constants/urls"
import {
  type NotesResponse,
  type Note,
  type NoteCreateResponse,
} from "@/src/lib/@types/Items/Note"

export interface NotesStoreType {
  /**
   * The notes in the store.
   */
  notes: Note[]
  /**
   * Whether the notes have been fetched.
   */
  isFetched: boolean
  /**
   * Sets whether the notes have been fetched.
   */
  setIsFetched: (isFetched: boolean) => void
  /**
   * Fetches the notes from the backend server.
   * @param session The session of the user.
   */
  fetchNotes: (session: string) => Promise<Note[]>
  /**
   * Sets the notes in the store.
   * @param notes The notes to set.
   */
  setNotes: (notes: Note[]) => void
  /**
   * Get note by uuid.
   * @param session and note uuid.
   */
  getNoteByuuid: (session: string, uuid: string) => Promise<Note | null>
  /**
   * Get latest note.
   * @param session.
   */
  getLatestNote: (session: string) => Promise<Note | null>
  /**
   * Adds a note to the store.
   * @param session The session of the user.
   * @param title The title of the note.
   * @param content The content of the note.
   */
  addNote: (
    session: string,
    title: string,
    content: string
  ) => Promise<Note | null>
  /**
   * Updates a note in the store and the backend server.
   * @param note The note to update.
   */
  updateNote: (note: Note) => void
  /**
   * Saves a note in the store and the backend server.
   * @param note The note to save.
   */
  saveNote: (session: string, note: Note) => Promise<void>
  /**
   * Deletes a note from the store.
   * @param note The note to delete.
   */
  deleteNote: (session: string, note: Note) => void
}

const useNotesStore = create<NotesStoreType>((set) => ({
  notes: [],
  isFetched: false,
  setIsFetched: (isFetched: boolean) => {
    set((state: NotesStoreType) => ({
      isFetched,
    }))
  },
  fetchNotes: async (session: string) => {
    let notes_: Note[] = []
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/notes/overview`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
      const res = data as NotesResponse
      notes_ = res.notes
    } catch (error) {
      const e = error as AxiosError
      console.error(e.cause)
    }
    set((state: NotesStoreType) => ({
      notes: notes_,
    }))
    return notes_
  },
  setNotes: (notes: Note[]) => {
    set((state: NotesStoreType) => ({
      notes,
    }))
  },
  getNoteByuuid: async (session: string, uuid: string) => {
    let note: Note | null = null
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/notes/${uuid}`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
      note = data.note[0]
    } catch (error) {
      const e = error as AxiosError
      console.error(e.cause)
    }
    return note
  },
  getLatestNote: async (session: string) => {
    let note: Note | null = null
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/notes/recent-updated/`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      note = data.note
    } catch (error) {
      const e = error as AxiosError
      console.error(e.cause)
    }
    return note
  },
  addNote: async (session: string, title: string, content: string) => {
    let res: NoteCreateResponse
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/notes/create`,
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      res = data as NoteCreateResponse
      set((state: NotesStoreType) => ({
        notes: [...state.notes, res.note],
      }))
      return res.note
    } catch (error) {
      const e = error as AxiosError
      console.error(e.cause)
      return null
    }
  },
  updateNote: (note: Note) => {
    set((state: NotesStoreType) => {
      const index = state.notes.findIndex((n) => n.uuid === note.uuid)
      if (index !== -1) {
        state.notes[index] = note
      }
      return {
        notes: state.notes,
      }
    })
  },
  saveNote: async (session: string, note: Note) => {
    try {
      const { data } = await axios.put(
        `${BACKEND_URL}/api/notes/${note.uuid}`,
        {
          title: note.title,
          content: note.content,
        },
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      const res = data as NoteCreateResponse
      set((state: NotesStoreType) => {
        const index = state.notes.findIndex((n) => n.uuid === res.note.uuid)
        if (index !== -1) {
          state.notes[index] = res.note
        }
        return {
          notes: state.notes,
        }
      })
    } catch (error) {
      const e = error as AxiosError
      console.error(e.cause)
    }
  },
  deleteNote: async (session: string, note: Note) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/notes/${note.uuid}`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })

      set((state: NotesStoreType) => {
        const index = state.notes.findIndex((n) => n.uuid === note.uuid)
        if (index !== -1) {
          state.notes.splice(index, 1)
        }
        return {
          notes: state.notes,
        }
      })
    } catch (error) {
      const e = error as AxiosError
      console.error("failed to delete note: ", e.message)
    }
  },
}))

export default useNotesStore
