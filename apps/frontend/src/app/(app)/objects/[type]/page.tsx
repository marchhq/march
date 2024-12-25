import { BookmarkView } from "@/src/components/objects/bookmarks/BookmarkView"
import { TodoView } from "@/src/components/objects/todo/TodoView"

interface Props {
  params: {
    type: string
  }
}

export default async function ObjectPage({ params }: Props) {
  const { type } = params

  switch (type) {
    case "todo":
      return <TodoView />
    case "bookmark":
      return <BookmarkView />
    default:
      return <div>{type} view</div>
  }
}
