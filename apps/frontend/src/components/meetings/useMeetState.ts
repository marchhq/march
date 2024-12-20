import { useReducer } from "react"

import { initialState, meetsReducer } from "./reducer"
import { Meet } from "@/src/lib/@types/Items/Meet"

export const useMeetState = () => {
  const [state, dispatch] = useReducer(meetsReducer, initialState)

  const setMeet = (newMeet: Meet) =>
    dispatch({ type: "SET_MEET", payload: newMeet })
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
  const setClosed = (closed: boolean) =>
    dispatch({ type: "SET_CLOSED", payload: closed })
  const setIsInitialLoad = (isInitialLoad: boolean) =>
    dispatch({ type: "SET_INITIAL_LOAD", payload: isInitialLoad })
  const setIsEditingTitle = (isEditingTitle: boolean) =>
    dispatch({ type: "SET_EDITING_TITLE", payload: isEditingTitle })

  return {
    state,
    dispatch,
    setMeet,
    setTitle,
    setContent,
    setIsSaved,
    setLoading,
    setNotFound,
    setClosed,
    setIsInitialLoad,
    setIsEditingTitle,
  }
}
