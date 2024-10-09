import { Icon } from "@iconify-icon/react"

import { ThisWeekItem } from "@/src/components/ThisWeek/ThisWeekItem"
import { ThisWeekNewItem } from "@/src/components/ThisWeek/ThisWeekNewItem"

interface ThisWeekSectionProps {
  icon: string
  title: string
}

export const ThisWeekSection: React.FC<ThisWeekSectionProps> = ({
  icon,
  title,
}: {
  icon: string
  title: string
}) => {
  return (
    <div className="flex flex-col flex-1 gap-4 group/section">
      <div className="flex items-center gap-2 text-xl text-foreground">
        <Icon icon={icon} className="text-[20px]" />
        <h2>{title}</h2>
      </div>
      <ThisWeekItem />
      <ThisWeekNewItem />
    </div>
  )
}
