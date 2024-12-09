import { useEffect, useMemo } from "react"

import { Editor } from "@tiptap/react"
import { debounce } from "lodash"

import { MeetState } from "./reducer"
import { Meet } from "@/src/lib/@types/Items/Meet"

interface MeetDispatch {
  type: string
  payload: any
}

export const useMeetEffects = (
  state: MeetState,
  dispatch: (action: MeetDispatch) => void,
  editor: Editor | null,
  handleUpdateMeet: (meetData: Meet) => Promise<void>,
  session: any,
  meetData: Meet,
  textareaRef: React.RefObject<HTMLTextAreaElement>
) => {
  const { meet, title, content, isSaved, isInitialLoad } = state

  //initial meet data
  useEffect(() => {
    if (!meetData?._id || meetData._id === state.meet?._id) return

    dispatch({ type: "SET_MEET", payload: meetData })
    dispatch({ type: "SET_TITLE", payload: meetData.title || "" })
    dispatch({
      type: "SET_CONTENT",
      payload: meetData.description || "<p></p>",
    })
  }, [meetData?._id, state.meet?._id]) // Only depend on IDs changing

  // Debounced save functions
  const debouncedUpdateMeet = useMemo(
    () =>
      debounce((updatedMeet: Meet) => {
        handleUpdateMeet(updatedMeet) // Changed to use handleUpdateMeet directly
        dispatch({ type: "SET_SAVED", payload: true })
      }, 500),
    [handleUpdateMeet, dispatch]
  )

  // Initialize state once when meetData changes
  useEffect(() => {
    if (!meetData || meet?.id === meetData.id) return

    const newContent = meetData.description || "<p></p>"
    dispatch({ type: "SET_MEET", payload: meetData })
    dispatch({ type: "SET_TITLE", payload: meetData.title || "" })
    dispatch({ type: "SET_CONTENT", payload: newContent })
  }, [meetData?.id]) // Only depend on the ID changing

  useEffect(() => {
    if (!editor?.commands || !content) return

    editor.commands.setContent(content)
  }, [editor, content])

  // Handle initial focus
  useEffect(() => {
    if (meet && !state.isLoading && isInitialLoad) {
      if (!title || title.trim() === "") {
        textareaRef.current?.focus()
      } else {
        editor?.commands.focus()
      }
      dispatch({ type: "SET_INITIAL_LOAD", payload: false })
    }
  }, [meet, state.isLoading, title, editor, isInitialLoad])

  // Auto-save effect for content changes
  useEffect(() => {
    if (!meet || isSaved) return

    debouncedUpdateMeet({
      ...meet,
      title,
      description: content,
    })
  }, [meet, title, content, isSaved, debouncedUpdateMeet])

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSaved) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isSaved])

  // Handle textarea height
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [title])

  // Cleanup
  useEffect(() => {
    return () => {
      debouncedUpdateMeet.cancel()
    }
  }, [debouncedUpdateMeet])
}
