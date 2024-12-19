import { useReducer } from "react"

import { initialState, notesReducer } from "../reducers/notesReducer"
import { Note } from "@/src/lib/@types/Items/Note"

export const useNoteState = () => {
  const [state, dispatch] = useReducer(notesReducer, initialState)

  const setNote = (newNote: Note) =>
    dispatch({ type: "SET_NOTE", payload: newNote })
  const setTitle = (newTitle: string) =>
    dispatch({ type: "SET_TITLE", payload: newTitle })
  const setContent = (newContent: string) =>
    dispatch({ type: "SET_CONTENT", payload: newContent })
  const setIsSaved = (isSaved: boolean) =>
    dispatch({ type: "SET_SAVED", payload: isSaved })
  const setLoading = (isLoading: boolean) =>
    dispatch({ type: "SET_LOADING", payload: isLoading })
  const setNotFound = (notFound: boolean) =>
    dispatch({ type: "SET_NOT_FOUND", payload: notFound })
  const setIsInitialLoad = (isInitialLoad: boolean) =>
    dispatch({ type: "SET_INITIAL_LOAD", payload: isInitialLoad })
  const setIsEditingTitle = (isEditingTitle: boolean) =>
    dispatch({ type: "SET_EDITING_TITLE", payload: isEditingTitle })

  return {
    state,
    dispatch,
    setNote,
    setTitle,
    setContent,
    setIsSaved,
    setLoading,
    setNotFound,
    setIsInitialLoad,
    setIsEditingTitle,
  }
}
