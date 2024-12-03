import React, { type JSX } from "react"

import { Icon } from "@iconify-icon/react"

const messages = [
  {
    description: "Pull your daily agenda to march",
  },
  {
    description: "Time box action items on your calendar ",
  },
  {
    description: "Interact using natural language to perform actions",
  },
]

const CalendarList = (): JSX.Element => {
  return (
    <ul className="max-w-[340px] space-y-4">
      {messages.map((message, index) => (
        <li key={index} className="ml-6 flex items-start space-x-3">
          <Icon
            icon="material-symbols-light:check"
            className="mt-0.5 text-[20px]"
          />
          <span className="text-left font-semibold text-gray-color">
            {message.description}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default CalendarList
