import { Page } from "@/src/lib/@types/Items/space"
import type { Editor } from "@tiptap/react"
import type { icons } from "lucide-react"

export interface Group {
  name?: string
  title?: string
  commands: Command[]
}

export interface Command {
  name: string
  label: string
  description: string
  aliases?: string[]
  iconName: keyof typeof icons
  action: (editor: Editor) => void
  shouldBeHidden?: (editor: Editor) => boolean
}

export interface MenuListProps {
  editor: Editor
  items: Group[]
  command: (command: Command) => void
}


type ActionType = "reschedule" | "space"
export interface InboxActionsProps {
  pages?: Page[]
  itemId?: string
  itemBelongsToPages?: string[]
  dueDate?: Date
  isAddItem?: boolean
  actions: ActionType[] | ""
  selectedPages?: string[]
  moveItemToSpace?: (
    itemId: string,
    spaceId: string,
    action: "add" | "remove"
  ) => void
  setDate?: (date: Date | undefined) => void
  setSelectedItemId?: (itemId: string) => void
  setSelectedPages?: (
    update: ((prevSelectedPages: string[]) => string[]) | string[]
  ) => void
}

export interface InboxItemProps {
  selectedItemId: string
  setSelectedItemId: (itemId: string) => void
  isAddItem?: boolean
}
