import { Metadata } from "next"

import { TodayPage } from "@/src/components/Today/TodayPage"
import generateMetadataHelper from "@/src/utils/seo"

export const metadata: Metadata = generateMetadataHelper({
  path: "/today",
  title: "Today",
  description: "engineered for makers",
})

const Today: React.FC = () => {
  return <TodayPage />
}

export default Today
