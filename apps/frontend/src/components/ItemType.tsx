import { Bookmark, SquareCheck, StickyNote } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { useItemTypeStore } from "../lib/store/type.store"

export const ItemType = () => {
  const { selectedType, setSelectedType } = useItemTypeStore()

  return (
    <section className="flex items-center gap-2">
      <div className="text-xs font-semibold text-secondary-foreground">
        Type
      </div>
      <span className="size-[3px] rounded-full bg-secondary-foreground"></span>
      <Select value={selectedType} onValueChange={setSelectedType}>
        <SelectTrigger className="w-[100px] p-0">
          <SelectValue placeholder="note" />
        </SelectTrigger>
        <SelectContent className="flex items-center border-border">
          <SelectItem value="note" className="hover-text">
            <div className="flex items-center space-x-2">
              <StickyNote size={18} />
              <span>note</span>
            </div>
          </SelectItem>
          <SelectItem value="todo">
            <div className="flex items-center space-x-2">
              <span>
                <SquareCheck size={18} />
              </span>
              <span>todo</span>
            </div>
          </SelectItem>
          <SelectItem value="link">
            <div className="flex items-center space-x-2">
              <span>
                <Bookmark size={18} />
              </span>
              <span>url</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </section>
  )
}
