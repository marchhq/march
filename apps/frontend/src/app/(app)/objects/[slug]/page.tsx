import { BookmarkView } from "@/src/components/objects/bookmarks/BookmarkView"
import { SourceView } from "@/src/components/objects/source/SourceView"
import { TodoView } from "@/src/components/objects/todo/TodoView"

interface Props {
  params: {
    slug: string
  }
}

export default async function ObjectPage({ params }: Props) {
  const { slug } = params

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
