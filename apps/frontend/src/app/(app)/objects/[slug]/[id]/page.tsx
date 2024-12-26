import { notFound } from "next/navigation"

import { NoteView } from "@/src/components/objects/note/NoteView"
import { getItemById } from "@/src/lib/server/actions/item"
import { getSession } from "@/src/lib/server/actions/sessions"

interface Props {
  params: {
    slug: string
    id: string
  }
}

export default async function ItemPage({ params }: Props) {
  const { slug, id } = params
  const session = getSession()

  if (!session) {
    throw new Error("authentication error")
  }

  const item = await getItemById(session, id)

  if (!item) {
    notFound()
  }

  switch (slug) {
    case "note":
    case "meeting":
      return <NoteView />
    default:
      return <div>unknown item type: {slug}</div>
  }
}
