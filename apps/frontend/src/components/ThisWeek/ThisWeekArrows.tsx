"use client"

import React from "react"

import { ChevronLeft, ChevronRight, Undo2 } from "lucide-react"

import { Button } from "../ui/button"

interface ThisWeekArrowsProps {
  onChangeWeek: (direction: "left" | "right" | "this") => void
  isCurrentWeek: boolean
}

export const ThisWeekArrows: React.FC<ThisWeekArrowsProps> = ({
  onChangeWeek,
  isCurrentWeek,
}) => {
  return (
    <div className="flex items-center gap-1 text-secondary-foreground">
      <Button
        variant="ghost"
        size="icon"
        className="size-5 border border-border hover:border-primary-foreground hover:text-primary-foreground"
        onClick={() => onChangeWeek("left")}
      >
        <ChevronLeft className="size-3" />
        <span className="sr-only">Previous week</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-5 border border-border hover:border-primary-foreground hover:text-primary-foreground"
        onClick={() => onChangeWeek("right")}
      >
        <ChevronRight className="size-3" />
        <span className="sr-only">Next week</span>
      </Button>
      {!isCurrentWeek && (
        <Button
          variant="ghost"
          size="icon"
          className="size-5 border border-border hover:border-primary-foreground hover:text-primary-foreground"
          onClick={() => onChangeWeek("this")}
        >
          <Undo2 className="size-3" />
          <span className="sr-only">This week</span>
        </Button>
      )}
    </div>
  )
}
