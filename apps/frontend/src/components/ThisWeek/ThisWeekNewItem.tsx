import { Icon } from "@iconify-icon/react"

const ThisWeekNewItem: React.FC = () => {
  return (
    <button className="invisible flex flex-col text-left text-sm gap-1 p-4 rounded-lg hover-bg group-hover/section:visible">
      <div className="flex items-center gap-2">
        <Icon icon="ic:round-plus" className="text-[18px]" />
        <p>New item</p>
      </div>
    </button>
  )
}

export default ThisWeekNewItem
