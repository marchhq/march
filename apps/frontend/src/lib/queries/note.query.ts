import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

import { Note, NoteCreateResponse, NotesResponse } from "../@types/Items/Note"
import { BACKEND_URL } from "../constants/urls"
import { useNoteStore } from "../store/note.store"

export const noteKeys = {
  all: ["notes"] as const,
  lists: (session: string, spaceId: string, blockId: string) =>
    [...noteKeys.all, "list", session, spaceId, blockId] as const,
  detail: (session: string, noteId: string) =>
    [...noteKeys.all, "detail", session, noteId] as const,
}

export const useNotes = (
  session: string,
  spaceId: string,
  blockId: string,
  options = {}
) => {
  const { updateNotes } = useNoteStore()

  return useQuery({
    queryKey: noteKeys.lists(session, spaceId, blockId),
    queryFn: async () => {
      if (!session || !spaceId || !blockId) {
        return []
      }

      try {
        const { data } = await axios.get<NotesResponse>(
          `${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/items`,
          {
            headers: {
              Authorization: `Bearer ${session}`,
            },
          }
        )
        const sortedNotes = data.items.sort(
          (a: Note, b: Note) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        updateNotes(sortedNotes)

        return sortedNotes
      } catch (error) {
        console.error("error fetching notes: ", error)
        return []
      }
    },
    enabled: Boolean(session && spaceId && blockId),
    ...options,
  })
}

export const useCreateNote = (
  session: string,
  spaceId: string,
  blockId: string
) => {
  const queryClient = useQueryClient()
  const { addNote, setCurrentNote, setSelectedNoteId } = useNoteStore()

  return useMutation({
    mutationFn: async ({
      title,
      content,
    }: {
      title: string
      content: string
    }) => {
      const { data } = await axios.post<NoteCreateResponse>(
        `${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/items`,
        {
          title,
          description: content,
          type: "note",
        },
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      return data.item
    },
    onSuccess: (newNote) => {
      queryClient.setQueryData<Note[]>(
        noteKeys.lists(session, spaceId, blockId),
        (old = []) => [newNote, ...old]
      )
      addNote(newNote)
      setCurrentNote(newNote)
      setSelectedNoteId(newNote._id)
    },
  })
}

export const useUpdateNote = (
  session: string,
  spaceId: string,
  blockId: string
) => {
  const queryClient = useQueryClient()
  const { updateNote } = useNoteStore()

  return useMutation({
    mutationFn: async ({
      noteId,
      title,
      description,
    }: {
      noteId: string
      title: string
      description: string
    }) => {
      const { data } = await axios.put<NoteCreateResponse>(
        `${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/items/${noteId}`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      return data.item
    },
    onSuccess: (updatedNote) => {
      queryClient.setQueryData<Note[]>(
        noteKeys.lists(session, spaceId, blockId),
        (oldNotes = []) =>
          oldNotes?.map((note) =>
            note._id === updatedNote._id ? updatedNote : note
          ) ?? []
      )
      updateNote(updatedNote)
    },
  })
}
