import * as React from "react"

import Container from "@/src/components/atoms/Container"
import PageSection from "@/src/components/PageSection"

const AppPage: React.FC = () => {
  return (
    <section className="h-full overflow-auto rounded-xl border border-white/10 bg-white/10 px-6 py-16 shadow-lg backdrop-blur-lg">
      <Container>
        <PageSection />
      </Container>
    </section>
  )
}

export default AppPage
