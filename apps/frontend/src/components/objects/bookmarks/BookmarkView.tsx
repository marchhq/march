import { ItemExpandedView } from "../../modals/ItemExpand"
import { ViewWrapper } from "../../wrappers/ViewWrapper"
import { AddItem } from "../AddItem"
import { ListView } from "../ListView"

export const BookmarkView = () => {
  return (
    <ViewWrapper>
      <AddItem placeholder="paste link or just plain text.." />
      <ListView />
      <ItemExpandedView />
    </ViewWrapper>
  )
}
