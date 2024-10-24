import { Metadata } from "next"

import ReadingListComponent from "@/src/components/Reading/ReadingListComponent"
import generateMetadataHelper from "@/src/utils/seo"

export const metadata: Metadata = generateMetadataHelper({
  path: "/space/reading-list",
  title: "Reading List",
  description: "engineered for makers",
})

export default function ReadingListPage() {
  return <ReadingListComponent />
}
