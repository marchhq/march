import * as React from "react"

import Container from "@/components/atoms/Container"
import InboxSection from "@/components/InboxSection"

const InboxPage: React.FC = () => {
  return (
    <section className="h-full overflow-y-auto rounded-xl border border-white/10 bg-white/10 px-6 pt-16 shadow-lg backdrop-blur-lg">
      <Container>
        <h1 className="mb-2 text-2xl font-semibold text-zinc-300">Inbox</h1>
        <InboxSection />
      </Container>
    </section>
  )
}

export default InboxPage
