import { BookmarkView } from "@/src/components/objects/bookmarks/BookmarkView"
import { NoteView } from "@/src/components/objects/note/NoteView"
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
    case "note":
    case "meetings":
      return <NoteView type={type} />
    default:
      return <div>{type} view</div>
  }
}
