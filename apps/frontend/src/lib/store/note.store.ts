import { create } from "zustand"

import { NoteState } from "../@types/Items/Note"

export const useNoteStore = create<NoteState>((set) => ({
  currentNote: null,
  selectedNoteId: null,
  spaceId: null,
  blockId: null,
  notes: [],
  setCurrentNote: (note) => set({ currentNote: note }),
  setSelectedNoteId: (id) => set({ selectedNoteId: id }),
  setContext: (spaceId, blockId) => set({ spaceId, blockId }),
  updateNotes: (notes) => set({ notes }),
  addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
  updateNote: (updateNote) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note._id === updateNote._id ? updateNote : note
      ),
      currentNote:
        state.currentNote?._id === updateNote._id
          ? updateNote
          : state.currentNote,
    })),
}))
