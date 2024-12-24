import { useState, useEffect } from "react"

export const useCtrlKey = () => {
  const [isCTRLheld, setIsCTRLheld] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control" && e.location === 1) {
        setIsCTRLheld(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control" && e.location === 1) {
        setIsCTRLheld(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return isCTRLheld
}
