import { ViewWrapper } from "../../wrappers/ViewWrapper"

export const NoteView = ({ type }: { type: "note" | "meetings" }) => {
  const content =
    type === "note" ? "this is a note view." : "this is a meeting view."

  return (
    <ViewWrapper>
      <div>{content}</div>
    </ViewWrapper>
  )
}
