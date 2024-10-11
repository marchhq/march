"use client"
import { useState, useRef, useEffect } from "react"

import Link from "next/link"

import { Meet } from "@/src/lib/@types/Items/Meet"
import { Link as LinkIcon } from "@/src/lib/icons/Link"
import classNames from "@/src/utils/classNames"
import { calculateMeetDuration, formatMeetTime } from "@/src/utils/meet"

interface StackProps {
  currentWeekMeets: Meet[]
  currentMeetId: string
}

export const Stack: React.FC<StackProps> = ({
  currentWeekMeets,
  currentMeetId,
}) => {
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

  const stackItems = currentWeekMeets.map((meet) => {
    const startTime = new Date(meet.metadata.start.dateTime)
    const endTime = new Date(meet.metadata.end.dateTime)
    return {
      id: meet._id,
      title: meet.title,
      url: meet.metadata.hangoutLink,
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
        <div className="w-full">
          {stackItems.map((meet) => (
            <div
              key={meet.id}
              className="-mx-4 mb-16 mt-8 space-y-3 rounded-md border-[#262626CC] p-4 hover:border"
            >
              <Link
                href={`/space/meetings/${meet.id}`}
                className="block cursor-pointer break-words text-[16px] font-medium text-primary-foreground"
              >
                {meet.title}
              </Link>
              <p className="text-[16px]">
                {meet.time}, {meet.duration} min
              </p>
              <a
                href={meet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <span className="flex items-center justify-start gap-2 text-[16px] hover:text-primary-foreground">
                  <LinkIcon />
                  Google Meet
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Stack
