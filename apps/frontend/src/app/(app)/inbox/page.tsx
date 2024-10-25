import { Metadata } from "next"

import { InboxPage } from "@/src/components/Inbox/InboxPage"
import generateMetadata from "@/src/utils/seo"

export const metadata: Metadata = generateMetadata({
  path: "/inbox",
  title: "Inbox",
  description: "engineered for makers",
})

const Inbox: React.FC = () => {
  return (
    <section className="h-full overflow-y-hidden bg-background px-16 py-10 text-secondary-foreground">
      <InboxPage />
    </section>
  )
}

export default Inbox
