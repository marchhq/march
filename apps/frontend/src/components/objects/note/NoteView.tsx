import { ViewWrapper } from "../../wrappers/ViewWrapper"

interface Props {
  type: string
  id: string
  data: any
}

export const NoteView = ({ type, id, data }: Props) => {
  return (
    <ViewWrapper>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </ViewWrapper>
  )
}
