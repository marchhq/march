import { AddBookmark } from "./AddBookMark"
import { ItemExpandedView } from "../../modals/ItemExpand"
import { ViewWrapper } from "../../wrappers/ViewWrapper"
import { ListView } from "../ListView"

export const BookmarkView = () => {
  return (
    <ViewWrapper>
      <AddBookmark />
      <ListView />
      <ItemExpandedView />
    </ViewWrapper>
  )
}
