import { redirect } from "next/navigation"

import { BookmarkView } from "@/src/components/objects/bookmarks/BookmarkView"
import { SourceView } from "@/src/components/objects/source/SourceView"
import { TodoView } from "@/src/components/objects/todo/TodoView"
import { getItemsByType } from "@/src/lib/server/actions/item"
import { getSession } from "@/src/lib/server/actions/sessions"

interface Props {
  params: {
    slug: string
  }
}

export default async function ObjectPage({ params }: Props) {
  const { slug } = params
  const session = getSession()

  if (["note", "meeting"].includes(slug)) {
    if (!session) {
      throw new Error("authentication required")
    }

    const items = await getItemsByType(session, slug)
    let itemId = ``
    if (items && items.length > 0) {
      if (items[0].id) {
        itemId += `${items[0].id}`
      } else {
        itemId += `${items[0]._id}`
      }
      redirect(`/objects/${slug}/${itemId}`)
    }

    return <div>no {slug} items found.</div>
  }

  switch (slug) {
    case "todo":
      return <TodoView />
    case "bookmark":
      return <BookmarkView />
    case "linear":
    case "github":
      return <SourceView />
    default:
      return <div>{slug} view</div>
  }
}
