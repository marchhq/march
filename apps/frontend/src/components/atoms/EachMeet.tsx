import React from "react"

import { Calendar } from "@phosphor-icons/react"

import { type Meet } from "@/src/lib/@types/Items/Meet"

interface EachMeetProps {
  meet: Meet
  setMeet: (meet: Meet) => void
  isActive: boolean
}

const EachMeet: React.FC<EachMeetProps> = ({
  meet,
  setMeet,
  isActive,
}) => {
  return (
    <button
      className={`rounded-lg border ${isActive ? "border-white/10 bg-white/10" : " border-transparent hover:bg-white/5"} p-2`}
      onClick={() => {
        setMeet(meet)
      }}
    >
      <div className="flex items-center justify-start gap-x-3 text-sm text-zinc-300">
        <Calendar size={16} weight="duotone" />
        <p>{meet.title}</p>
      </div>
      <p className="ml-8 mt-1 text-xs text-zinc-500">
        {meet.date} · 
        {/* {meet.time} */}
      </p>
    </button>
  )
}

export default EachMeet
