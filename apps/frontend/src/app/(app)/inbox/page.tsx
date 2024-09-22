import * as React from "react"

import Container from "@/src/components/atoms/Container"
import InboxSection from "@/src/components/InboxSection"

const InboxPage: React.FC = () => {
  return (
    <section className="h-full overflow-y-auto bg-background px-6  py-8 pt-16 shadow-lg backdrop-blur-lg">
      <Container>
        <InboxSection />
      </Container>
    </section>
  )
}

export default InboxPage
