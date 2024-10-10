import { Icon } from "@iconify-icon/react"
import { ThisWeekItem } from "@/src/components/ThisWeek/ThisWeekItem"
import { ThisWeekNewItem } from "@/src/components/ThisWeek/ThisWeekNewItem"
import { Item } from "@/src/lib/@types/Items/Items"
import { Droppable } from "react-beautiful-dnd"
import { Provider } from "@radix-ui/react-toast"

interface ThisWeekSectionProps {
  icon: string
  title: string
  items: Item[]
  status: string
}

export const ThisWeekSection: React.FC<ThisWeekSectionProps> = ({
  icon,
  title,
  items,
  status,
}) => {
  return (
    <div className="flex flex-col flex-1 gap-4 group/section">
      <div className="flex items-center gap-2 text-xl text-foreground">
        <Icon icon={icon} className="text-[20px]" />
        <h2>{title}</h2>
      </div>
      <Droppable droppableId={status}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items.map((item, index) => (
              <ThisWeekItem key={item._id} item={item} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <ThisWeekNewItem />
    </div>
  )
}
