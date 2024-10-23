import * as React from "react"

import { Metadata } from "next"

import generateMetadataHelper from "@/src/utils/seo"

export const metadata: Metadata = generateMetadataHelper({
  path: "/spaces",
  title: "Spaces",
  description: "engineered for makers",
})

const SpacePage: React.FC = () => {
  return (
    <section className="size-full overflow-auto bg-background px-8 py-16">
      <p className="text-secondary-foreground">
        Select a space from the sidebar
      </p>
    </section>
  )
}

export default SpacePage
