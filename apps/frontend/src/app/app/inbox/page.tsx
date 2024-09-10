import * as React from "react"

import Container from "@/src/components/atoms/Container"
import InboxSection from "@/src/components/InboxSection"

const InboxPage: React.FC = () => {
  return (
    <section className="h-full overflow-y-auto rounded-xl border border-white/10 bg-[#F8F8F8] dark:bg-white/10 px-6 pt-16 shadow-lg backdrop-blur-lg">
      <Container>
        <InboxSection />
      </Container>
    </section>
  )
}

export default InboxPage
