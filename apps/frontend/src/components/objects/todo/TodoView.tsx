import { ItemExpandedView } from "../../modals/ItemExpand"
import { ViewWrapper } from "../../wrappers/ViewWrapper"
import { AddItem } from "../AddItem"
import { ListView } from "../ListView"

export const TodoView = () => {
  return (
    <ViewWrapper>
      <AddItem />
      <ListView />
      <ItemExpandedView />
    </ViewWrapper>
  )
}
