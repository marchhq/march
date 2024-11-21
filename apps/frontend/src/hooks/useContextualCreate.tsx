import { useState, useCallback, useEffect } from "react"

interface ContextualCreateState {
  isOpen: boolean
  context: "inbox" | "thisWeek" | "readingList" | null
  inputText: string
  position: { x: number; y: number }
}

export const useContextualCreate = () => {
  const [state, setState] = useState<ContextualCreateState>({
    isOpen: false,
    context: null,
    inputText: "",
    position: { x: 0, y: 0 },
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Command+C (Mac) or Control+C (Windows)
      if ((e.metaKey || e.ctrlKey) && e.key === "c") {
        e.preventDefault()
        // Get selected text
        const selectedText = window.getSelection()?.toString() || ""

        // Get cursor position or selection position
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const rect = range.getBoundingClientRect()

          // Determine context based on where the cursor is
          const context = determineContext()

          setState({
            isOpen: true,
            context,
            inputText: selectedText,
            position: {
              x: rect.left,
              y: rect.bottom + window.scrollY,
            },
          })
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const determineContext = (): "inbox" | "thisWeek" | "readingList" => {
    // Check URL path
    const path = window.location.pathname
    if (path.includes("inbox")) return "inbox"
    if (path.includes("this-week")) return "thisWeek"
    if (path.includes("space/reading-list")) return "readingList"

    return "inbox"
  }

  const closeContextualCreate = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  return {
    ...state,
    closeContextualCreate,
  }
}
