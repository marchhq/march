"use client"

import { Meet } from "@/src/lib/@types/Items/Meet"
import classNames from "@/src/utils/classNames"
import { useState } from "react"
import Link from "next/link"
import { calculateMeetDuration, formatMeetTime } from "@/src/utils/meet"
import { Link as LinkIcon } from "@/src/lib/icons/Link"

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
        className="hover:text-foreground cursor-pointer"
      >
        stack
      </span>
      {stackItems.map((meet) => (
        <div
          key={meet.id}
          className={classNames(
            closeToggle ? "hidden" : "visible",
            meet.id === currentMeetId
              ? "border border-[#262626CC] rounded-md p-3 -mx-3"
              : "",
            "space-y-2 mb-8 mt-4"
          )}
        >
          <Link
            href={`/space/meetings/${meet.id}`}
            className=" cursor-pointer text-primary-foreground font-medium text-[16px] block"
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
            <span className="flex justify-start items-center gap-2 text-[16px] text-primary-foreground">
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
