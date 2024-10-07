import { Icon } from "@iconify-icon/react"

const ThisWeekItem: React.FC = () => {
  return (
    <div className="flex flex-col text-left gap-1 p-4 border border-border rounded-lg hover-bg group">
      <div className="flex justify-between text-foreground">
        <div className="w-full flex items-start gap-2">
          <Icon icon="ri:github-fill" className="mt-0.5 text-[18px]" />
          <p>title</p>
        </div>
        <div className="text-secondary-foreground text-xs">
          <button className="invisible group-hover:visible hover-text">
            edit
          </button>
        </div>
      </div>
      <div className="ml-[18px] pl-2 text-xs">
        <p>description</p>
      </div>
    </div>
  )
}

export default ThisWeekItem
