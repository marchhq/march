import { AddTodo } from "./AddTodo"
import { TodoItems } from "./TodoItems"
import { ViewWrapper } from "../../wrappers/ViewWrapper"

export const TodoView = () => {
  return (
    <ViewWrapper>
      <AddTodo />
      <TodoItems />
    </ViewWrapper>
  )
}
