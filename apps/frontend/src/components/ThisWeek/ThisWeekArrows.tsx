"use client"

import React from "react"

import { LeftChevron, RightChevron } from "@/src/lib/icons/Navigation"

const ThisWeekArrows: React.FC = () => {
  return (
    <div className="flex items-center justify-between gap-4">
      <button onClick={() => console.log("left")} className="p-2">
        <LeftChevron />
      </button>
      <button onClick={() => console.log("right")} className="p-2">
        <RightChevron />
      </button>
    </div>
  )
}

export default ThisWeekArrows
