import { AddBookmark } from "./AddBookMark"
import { ViewWrapper } from "../../wrappers/ViewWrapper"
import { TodoItems } from "../todo/TodoItems"

export const BookmarkView = () => {
  return (
    <ViewWrapper>
      <AddBookmark />
      <TodoItems />
    </ViewWrapper>
  )
}
