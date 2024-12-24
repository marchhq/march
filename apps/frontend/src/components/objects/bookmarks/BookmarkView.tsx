import { AddBookmark } from "./AddBookMark"
import { ItemExpandedView } from "../../modals/ItemExpand"
import { ViewWrapper } from "../../wrappers/ViewWrapper"
import { TodoItems } from "../todo/TodoItems"

export const BookmarkView = () => {
  return (
    <ViewWrapper>
      <AddBookmark />
      <TodoItems />
      <ItemExpandedView />
    </ViewWrapper>
  )
}
