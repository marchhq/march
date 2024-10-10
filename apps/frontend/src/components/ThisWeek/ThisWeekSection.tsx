import { Icon } from "@iconify-icon/react"

import { ThisWeekItem } from "@/src/components/ThisWeek/ThisWeekItem"
import { ThisWeekNewItem } from "@/src/components/ThisWeek/ThisWeekNewItem"
import { Item } from "@/src/lib/@types/Items/Items"

interface ThisWeekSectionProps {
  icon: string
  title: string
  items: Item[]
}

export const ThisWeekSection: React.FC<ThisWeekSectionProps> = ({
  icon,
  title,
  items,
}: {
  icon: string
  title: string
  items: Item[]
}) => {
  return (
    <div className="flex flex-col flex-1 gap-4 group/section">
      <div className="flex items-center gap-2 text-xl text-foreground">
        <Icon icon={icon} className="text-[20px]" />
        <h2>{title}</h2>
      </div>
      {items.length > 0 ? (
        items.map((item) => <ThisWeekItem key={item._id} item={item} />)
      ) : (
        <p className="text-secondary">No items</p>
      )}
      <ThisWeekNewItem />
    </div>
  )
}
