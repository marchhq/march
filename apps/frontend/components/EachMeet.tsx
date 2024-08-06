import React from "react"

import { Calendar } from "@phosphor-icons/react"

interface Meet {
  title: string
  date: string
  time: string
}

interface EachMeetProps {
  meet: Meet
  setActiveMeet: (index: number) => void
  activeMeet: number
  index: number
}

const EachMeet: React.FC<EachMeetProps> = ({
  meet,
  setActiveMeet,
  activeMeet,
  index,
}) => {
  return (
    <button
      className={`rounded-lg border ${activeMeet === index ? "border-white/10 bg-white/10" : " border-transparent hover:bg-white/5"} p-2`}
      onClick={() => {
        setActiveMeet(index)
      }}
    >
      <div className="flex items-center justify-start gap-x-3 text-sm text-zinc-300">
        <Calendar size={16} weight="duotone" />
        <p>{meet.title}</p>
      </div>
      <p className="ml-8 mt-1 text-xs text-zinc-500">
        {meet.date} · {meet.time}
      </p>
    </button>
  )
}

export default EachMeet
