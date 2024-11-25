"use client"
import { useState, useRef, useEffect } from "react"

import { Icon } from "@iconify-icon/react/dist/iconify.mjs"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Meet } from "@/src/lib/@types/Items/Meet"
import classNames from "@/src/utils/classNames"
import { calculateMeetDuration, formatMeetTime } from "@/src/utils/meet"

interface StackProps {
  meetings: Meet[]
  currentMeetId: string
}

export const Stack: React.FC<StackProps> = ({ meetings, currentMeetId }) => {
  const router = useRouter()
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

  const handleMeetingClick = (e: React.MouseEvent, meetId: string) => {
    e.preventDefault()
    router.push(`/space/meetings/${meetId}`, { scroll: false })
  }

  return (
    <div className="flex items-start gap-16">
      <div className="shrink-0">
        <button
          className="hover-text mt-1 flex items-center"
          onClick={handleClose}
        >
          <Icon icon="basil:stack-solid" style={{ fontSize: "15px" }} />
        </button>
      </div>

      <div
        ref={stackRef}
        className={classNames(
          closeToggle ? "hidden" : "visible",
          "ml-2 flex max-h-screen w-full max-w-[200px] flex-col gap-8 overflow-y-auto text-sm text-secondary-foreground"
        )}
        style={{ maxHeight }}
      >
        <div className="flex flex-col gap-2 border-l border-border">
          {stackItems.map((meet) => (
            <Link
              key={meet.id}
              href={`/space/meetings/${meet.id}`}
              onClick={(e) => handleMeetingClick(e, meet.id)}
            >
              <button
                className={`-ml-px truncate border-l border-border pl-2 text-start ${
                  meet.id === currentMeetId
                    ? "border-l-secondary-foreground text-primary-foreground"
                    : "border-border hover:text-primary-foreground"
                }`}
              >
                {meet.title}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Stack
