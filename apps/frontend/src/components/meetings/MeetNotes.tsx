"use client"

import { useState, useEffect, useRef, useCallback } from "react"

import { useMeetEffects } from "./useMeetEffects"
import { useMeetHandlers } from "./useMeetHandlers"
import { useMeetState } from "./useMeetState"
import SpaceEditor from "../editor/space-editor"
import { useAuth } from "@/src/contexts/AuthContext"
import useEditorHook from "@/src/hooks/useEditor.hook"
import { Meet } from "@/src/lib/@types/Items/Meet"

export const MeetNotes = ({ meetData }: { meetData: Meet }): JSX.Element => {
  const { session } = useAuth()
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)

  const { state, setTitle, setContent, setMeet, setIsSaved, dispatch } =
    useMeetState()

  useEffect(() => {
    console.log("Setting meet data:", meetData)
    if (meetData?.id) {
      setMeet(meetData)
      setTitle(meetData.title || "")
      setContent(meetData.description || "<p></p>")
    }
  }, [meetData?.id])

  const editor = useEditorHook({
    content: state.content,
    setContent: useCallback(
      (newContent: string) => {
        setContent(newContent)
        setIsSaved(false)
      },
      [setContent, setIsSaved]
    ),
    setIsSaved,
  })

  const { handleUpdateMeet, handleSaveTitle, handleSaveContent } =
    useMeetHandlers(state, dispatch)

  useMeetEffects(
    state,
    dispatch,
    editor,
    handleUpdateMeet,
    session,
    meetData,
    textareaRefTitle
  )

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTitle(e.target.value)
      setIsSaved(false)
      handleSaveTitle(e.target.value)
    },
    [setTitle, setIsSaved, handleSaveTitle]
  )

  const handleTextareaKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== "Enter") return

      e.preventDefault()

      if (e.shiftKey) {
        const textarea = e.currentTarget
        const cursorPosition = textarea.selectionStart
        const newValue =
          state.title.slice(0, cursorPosition) +
          "\n" +
          state.title.slice(cursorPosition)

        setTitle(newValue)
        handleSaveTitle(newValue)
      } else if (editor) {
        editor.commands.focus()
        editor.commands.setTextSelection(0)
      }
    },
    [state.title, editor, setTitle, handleSaveTitle]
  )

  if (!meetData) {
    return <div>No meeting data available</div>
  }

  return (
    <div>
      <SpaceEditor
        note={meetData}
        title={state.title}
        editor={editor}
        handleTitleChange={handleTitleChange}
        handleTextareaKeyDown={handleTextareaKeyDown}
        textareaRef={textareaRefTitle}
      />
    </div>
  )
}
