import { TodoView } from "@/src/components/todo/TodoView"

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
    default:
      return <div>{type} view</div>
  }
}
