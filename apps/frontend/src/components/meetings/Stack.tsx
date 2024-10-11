"use client"

import { useState } from "react"

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

  const handleClose = () => setCloseToggle(!closeToggle)

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
    <>
      <span
        onClick={handleClose}
        className="cursor-pointer hover:text-foreground"
      >
        stack
      </span>
      {stackItems.map((meet) => (
        <div
          key={meet.id}
          className={classNames(
            closeToggle ? "hidden" : "visible",
            meet.id === currentMeetId
              ? "-mx-3 rounded-md border border-[#262626CC] p-3"
              : "",
            "mb-8 mt-4 space-y-2"
          )}
        >
          <Link
            href={`/space/meetings/${meet.id}`}
            className="block cursor-pointer text-[16px] font-medium text-primary-foreground"
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
            <span className="flex items-center justify-start gap-2 text-[16px] text-primary-foreground">
              <LinkIcon />
              Google Meet
            </span>
          </a>
        </div>
      ))}
    </>
  )
}

export default Stack
