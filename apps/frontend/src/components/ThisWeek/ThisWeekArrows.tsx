"use client"

import React from "react"
import { LeftChevron, RightChevron } from "@/src/lib/icons/Navigation"

interface ThisWeekArrowsProps {
  onChangeWeek: (direction: "left" | "right") => void
}

export const ThisWeekArrows: React.FC<ThisWeekArrowsProps> = ({
  onChangeWeek,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <button onClick={() => onChangeWeek("left")} className="p-2">
        <LeftChevron />
      </button>
      <button onClick={() => onChangeWeek("right")} className="p-2">
        <RightChevron />
      </button>
    </div>
  )
}
