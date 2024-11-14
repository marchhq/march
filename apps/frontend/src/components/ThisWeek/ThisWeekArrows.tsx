"use client"

import React from "react"

import { LeftChevron, RightChevron } from "@/src/lib/icons/Navigation"

interface ThisWeekArrowsProps {
  onChangeWeek: (direction: "left" | "right" | "this") => void
}

export const ThisWeekArrows: React.FC<ThisWeekArrowsProps> = ({
  onChangeWeek,
}) => {
  return (
    <div className="flex items-center gap-2 text-secondary-foreground">
      <button className="px-1" onClick={() => onChangeWeek("left")}>
        <LeftChevron className="hover-text" />
      </button>
      <button onClick={() => onChangeWeek("this")}>
        <span className="hover-text">this week</span>
      </button>
      <button className="px-1" onClick={() => onChangeWeek("right")}>
        <RightChevron className="hover-text" />
      </button>
    </div>
  )
}
