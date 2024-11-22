import axios, { type AxiosError } from "axios"
import { create } from "zustand"

import { BACKEND_URL } from "../constants/urls"
import {
  NotesResponse,
  Note,
  NoteCreateResponse,
  NotesStoreType,
} from "@/src/lib/@types/Items/Note"

const useNotesStore = create<NotesStoreType>((set) => ({
  notes: [],
  spaceId: null,
  blockId: null,
  latestNote: null,
  isFetched: false,
  setIsFetched: (isFetched: boolean) => {
    set((state: NotesStoreType) => ({
      isFetched,
    }))
  },
  fetchNotes: async (session: string) => {
    let notes_: Note[] = []
    try {
      const spaces = await axios.get(`${BACKEND_URL}/spaces`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
      const notesSpace = spaces.data.spaces.find(
        (space) => space.name == "Notes"
      )
      set({ spaceId: notesSpace._id })
      const blocks = await axios.get(
        `${BACKEND_URL}/spaces/${notesSpace._id}/blocks`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      const notesBlock = blocks.data.blocks[0]
      set({ blockId: notesBlock._id })
      const { data } = await axios.get(
        `${BACKEND_URL}/spaces/${notesSpace._id}/blocks/${notesBlock._id}/items`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      const res = data as NotesResponse
      notes_ = res.items.sort(
        (a, b) => Number(new Date(a.createdAt)) - Number(new Date(b.createdAt))
      )

      const latestNote = notes_.reduce((latest, current) => {
        return new Date(latest.updatedAt) > new Date(current.updatedAt)
          ? latest
          : current
      }, notes_[0])

      set((state: NotesStoreType) => ({
        notes: notes_,
        latestNote, // Update the state with the latest note
      }))
    } catch (error) {
      const e = error as AxiosError
      console.error(e)
    }
    return notes_
  },
  setNotes: (notes: Note[]) => {
    set((state: NotesStoreType) => ({
      notes,
    }))
  },
  addNote: async (session: string, title: string, content: string) => {
    let res: NoteCreateResponse
    const { spaceId, blockId } = useNotesStore.getState()
    try {
      if (spaceId && blockId) {
        const { data } = await axios.post(
          `${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/items`,
          {
            title,
            description: content,
            type: "note",
            spaces: spaceId,
            blocks: blockId,
          },
          {
            headers: {
              Authorization: `Bearer ${session}`,
            },
          }
        )
        res = data as NoteCreateResponse
        set((state: NotesStoreType) => ({
          notes: [...state.notes, res.item],
        }))
        return res.item
      } else {
        return null
      }
    } catch (error) {
      const e = error as AxiosError
      console.error(e.cause)
      return null
    }
  },
  updateNote: (note: Note) => {
    set((state: NotesStoreType) => {
      const index = state.notes.findIndex((n) => n._id === note._id)
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
      const { spaceId, blockId } = useNotesStore.getState()
      const { data } = await axios.put(
        `${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/items/${note._id}`,
        {
          title: note.title,
          description: note.description,
        },
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      const res = data as NoteCreateResponse
      set((state: NotesStoreType) => {
        const index = state.notes.findIndex((n) => n._id === res.item._id)
        if (index !== -1) {
          state.notes[index] = res.item
        }
        return {
          notes: state.notes,
        }
      })
    } catch (error) {
      const e = error as AxiosError
      console.error(e)
    }
  },
  deleteNote: async (session: string, note: Note) => {
    const { spaceId, blockId } = useNotesStore.getState()
    try {
      set((state: NotesStoreType) => {
        const index = state.notes.findIndex((n) => n._id === note._id)
        if (index !== -1) {
          state.notes.splice(index, 1)
        }
        return {
          notes: state.notes,
        }
      })
      await axios.put(
        `${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/items/${note._id}`,
        {
          isDeleted: true,
        },
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
    } catch (error) {
      const e = error as AxiosError
      console.error("failed to delete note: ", e.message)
    }
  },
}))

export default useNotesStore
