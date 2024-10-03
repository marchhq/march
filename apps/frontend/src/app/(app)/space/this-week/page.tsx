import React from "react"
import ThisWeekComponent from "@/src/components/ThisWeek/ThisWeekComponent"

const ThisWeekPage: React.FC = () => {
  return (
    <div className="size-full overflow-auto bg-background p-16 text-secondary-foreground">
      <ThisWeekComponent />
    </div>
  )
}

export default ThisWeekPage
