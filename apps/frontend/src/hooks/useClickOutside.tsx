import * as React from "react"

type Event = MouseEvent | TouchEvent

const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  handler: (event: Event) => void
): void => {
  React.useEffect(() => {
    const listener = (event: Event): void => {
      const el = ref?.current
      if (el == null || el.contains(event?.target as Node)) {
        return
      }

      handler(event) // Call the handler only if the click is outside of the element passed.
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler]) // Reload only if ref or handler changes
}

export default useClickOutside
