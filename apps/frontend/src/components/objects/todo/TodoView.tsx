import { AddTodo } from "./AddTodo"
import { ItemExpandedView } from "../../modals/ItemExpand"
import { ViewWrapper } from "../../wrappers/ViewWrapper"
import { ListView } from "../ListView"

export const TodoView = () => {
  return (
    <ViewWrapper>
      <AddTodo />
      <ListView />
      <ItemExpandedView />
    </ViewWrapper>
  )
}
