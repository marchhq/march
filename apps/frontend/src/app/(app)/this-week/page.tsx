import React from "react"

import { Metadata } from "next"

import { ThisWeekPage } from "@/src/components/ThisWeek/ThisWeekPage"
import generateMetadataHelper from "@/src/utils/seo"

export const metadata: Metadata = generateMetadataHelper({
  path: "/this-week",
  title: "This Week",
  description: "engineered for makers",
})

const ThisWeek: React.FC = () => {
  return (
    <div className="h-full bg-background text-secondary-foreground">
      <ThisWeekPage />
    </div>
  )
}

export default ThisWeek
