"use client"
import { useState, useRef, useEffect } from "react"

import Link from "next/link"

import { Meet } from "@/src/lib/@types/Items/Meet"
import classNames from "@/src/utils/classNames"
import { calculateMeetDuration, formatMeetTime } from "@/src/utils/meet"

interface StackProps {
  meetings: Meet[]
  currentMeetId: string
}

export const Stack: React.FC<StackProps> = ({ meetings, currentMeetId }) => {
  const [closeToggle, setCloseToggle] = useState(false)
  const [maxHeight, setMaxHeight] = useState("auto")
  const stackRef = useRef<HTMLDivElement>(null)

  const handleClose = () => setCloseToggle(!closeToggle)

  useEffect(() => {
    const updateMaxHeight = () => {
      if (stackRef.current) {
        const viewportHeight = window.innerHeight
        const stackTop = stackRef.current.getBoundingClientRect().top
        const maxStackHeight = viewportHeight - stackTop - 20 // 20px buffer
        setMaxHeight(`${maxStackHeight}px`)
      }
    }

    updateMaxHeight()
    window.addEventListener("resize", updateMaxHeight)

    return () => window.removeEventListener("resize", updateMaxHeight)
  }, [])

  const stackItems = meetings.map((meet) => {
    const startTime = new Date(meet.metadata?.start?.dateTime)
    const endTime = new Date(meet.metadata?.end?.dateTime)
    return {
      id: meet.id,
      title: meet.title,
      url: meet.metadata?.hangoutLink,
      time: formatMeetTime(startTime, endTime),
      duration: calculateMeetDuration(startTime, endTime),
    }
  })

  return (
    <div className="flex w-full flex-col">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <span
        onClick={handleClose}
        className="mb-4 cursor-pointer hover:text-foreground"
      >
        stack
      </span>
      <div
        ref={stackRef}
        className={classNames(
          closeToggle ? "hidden" : "visible",
          "overflow-y-auto overflow-x-hidden px-4"
        )}
        style={{ maxHeight }}
      >
        <div className="mt-2 flex flex-col gap-2 border-l border-border">
          {stackItems.map((meet) => (
            <Link key={meet.id} href={`/space/meetings/${meet.id}`}>
              <button
                className={`-ml-px truncate border-l border-border pl-2 text-start             ${
                  meet.id === currentMeetId
                    ? "border-l-secondary-foreground text-primary-foreground"
                    : "border-border hover:text-primary-foreground"
                }`}
              >
                {meet.title}
              </button>{" "}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Stack
