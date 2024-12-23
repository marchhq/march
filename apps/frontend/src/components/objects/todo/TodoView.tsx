import { AddTodo } from "./AddTodo"
import { ViewWrapper } from "../../wrappers/ViewWrapper"

export const TodoView = () => {
  return (
    <ViewWrapper>
      <AddTodo />
    </ViewWrapper>
  )
}
