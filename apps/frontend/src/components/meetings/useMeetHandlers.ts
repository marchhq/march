import { useCallback } from "react"

import { useAuth } from "@/src/contexts/AuthContext"
import { Meet } from "@/src/lib/@types/Items/Meet"
import { useMeetsStore } from "@/src/lib/store/meets.store"

export const useMeetHandlers = (state, dispatch) => {
  const { session } = useAuth()
  const { updateMeet } = useMeetsStore()
  const { meet, title, content, isSaved } = state

  const saveMeetToServer = useCallback(
    async (meet: Meet): Promise<void> => {
      try {
        await updateMeet(session, meet, meet.id)
      } catch (error) {
        console.error("Error saving meet:", error)
      }
    },
    [session, updateMeet]
  )

  const handleUpdateMeet = useCallback(
    async (meetData: Meet) => {
      if (!meetData?._id) {
        console.error("handleUpdateMeet: Missing meet ID", meetData)
        return
      }

      try {
        dispatch({ type: "SET_SAVED", payload: false })
        await updateMeet(session, meetData, meetData._id)
        dispatch({ type: "SET_SAVED", payload: true })
      } catch (error) {
        console.error("Error updating meet:", error)
      }
    },
    [session, updateMeet, dispatch]
  )

  const handleSaveContent = useCallback(
    async (newContent: string) => {
      if (!meet) return

      try {
        dispatch({ type: "SET_SAVED", payload: false })
        await updateMeet(session, { ...meet, description: newContent }, meet.id)
        dispatch({ type: "SET_SAVED", payload: true })
      } catch (error) {
        console.error("Error saving content:", error)
      }
    },
    [meet, session, updateMeet, dispatch]
  )

  const handleSaveTitle = useCallback(
    async (newTitle: string) => {
      if (!meet) return

      try {
        dispatch({ type: "SET_SAVED", payload: false })
        await updateMeet(session, { ...meet, title: newTitle }, meet.id)
        dispatch({ type: "SET_SAVED", payload: true })
      } catch (error) {
        console.error("Error saving title:", error)
      }
    },
    [meet, session, updateMeet, dispatch]
  )

  return {
    saveMeetToServer,
    handleUpdateMeet,
    handleSaveContent,
    handleSaveTitle,
  }
}
