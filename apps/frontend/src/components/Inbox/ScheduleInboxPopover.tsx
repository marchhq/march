import React, { useState } from "react"

import { Icon } from "@iconify-icon/react"

import ScheduleItem from "./ScheduleItem"
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"

type Props = {
  title: string
  _id: string
}

const ScheduleInboxPopover = ({ title, _id }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const preventPropagation = (event: React.MouseEvent) => {
    event.stopPropagation()
  }

  const handleDateSelect = () => {
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger onClick={preventPropagation} asChild>
        <button className="hover-text invisible group-hover:visible">
          <Icon icon="humbleicons:clock" className="mt-0.5 text-lg" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        onClick={preventPropagation}
        className="w-96 h-80 p-5 border dark:bg-neutral-900 border-muted"
      >
        <ScheduleItem title={title} _id={_id} onDateSelect={handleDateSelect} />
      </PopoverContent>
    </Popover>
  )
}

export default ScheduleInboxPopover
