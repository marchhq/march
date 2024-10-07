import React from "react"
import { ThisWeekPage } from "@/src/components/ThisWeek/ThisWeekPage"

const ThisWeek: React.FC = () => {
  return (
    <div className="size-full overflow-auto bg-background p-16 text-secondary-foreground">
      <ThisWeekPage />
    </div>
  )
}

export default ThisWeek
