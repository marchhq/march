import { Icon } from "@iconify-icon/react"
import ThisWeekItem from "./ThisWeekItem"
import ThisWeekNewItem from "./ThisWeekNewItem"

interface ThisWeekSectionProps {
  icon: string
  title: string
}

const ThisWeekSection: React.FC<ThisWeekSectionProps> = ({
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

export default ThisWeekSection
