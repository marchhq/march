"use client"

import React from "react"

import { Icon } from "@iconify-icon/react"

interface ThisWeekArrowsProps {
  onChangeWeek: (direction: "left" | "right") => void
}

export const ThisWeekArrows: React.FC<ThisWeekArrowsProps> = ({
  onChangeWeek,
}) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <button
        onClick={() => onChangeWeek("left")}
        className="hover-text flex items-center rounded-lg p-1"
      >
        <Icon icon="eva:arrow-left-fill" className="text-[20px]" />
      </button>
      <button
        onClick={() => onChangeWeek("right")}
        className="hover-text flex items-center rounded-lg p-1"
      >
        <Icon icon="eva:arrow-right-fill" className="text-[20px]" />
      </button>
    </div>
  )
}
