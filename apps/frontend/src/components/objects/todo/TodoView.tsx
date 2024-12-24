import { AddTodo } from "./AddTodo"
import { TodoItems } from "./TodoItems"
import { ItemExpandedView } from "../../modals/ItemExpand"
import { ViewWrapper } from "../../wrappers/ViewWrapper"

export const TodoView = () => {
  return (
    <ViewWrapper>
      <AddTodo />
      <TodoItems />
      <ItemExpandedView />
    </ViewWrapper>
  )
}
