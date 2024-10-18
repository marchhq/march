import React from "react"

import { ThisWeekPage } from "@/src/components/ThisWeek/ThisWeekPage"

const ThisWeek: React.FC = () => {
  return (
    <div className="h-full bg-background text-secondary-foreground">
      <ThisWeekPage />
    </div>
  )
}

export default ThisWeek
