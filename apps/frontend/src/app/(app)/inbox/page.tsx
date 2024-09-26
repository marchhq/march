"use client"

import React, { useState, useEffect } from "react"

import Container from "@/src/components/atoms/Container"
import InboxSection from "@/src/components/Inbox/InboxSection"

const InboxPage: React.FC = () => {
  const [addingItem, setAddingItem] = useState(false)

  return (
    <section className="h-full overflow-y-auto bg-background px-6  py-8 pt-16 shadow-lg backdrop-blur-lg">
      <Container>
        <InboxSection />
      </Container>
    </section>
  )
}

export default InboxPage
