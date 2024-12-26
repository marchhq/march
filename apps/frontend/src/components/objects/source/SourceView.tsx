import { ItemExpandedView } from "../../modals/ItemExpand"
import { ViewWrapper } from "../../wrappers/ViewWrapper"
import { ListView } from "../ListView"

export const SourceView = () => {
  return (
    <ViewWrapper>
      <ListView />
      <ItemExpandedView />
    </ViewWrapper>
  )
}
