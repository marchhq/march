import React from "react"

import { Check } from "lucide-react"

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
          <span className="mt-0.5 shrink-0">
            <Check size={18} color="#464748" />
          </span>
          <span className="text-left font-semibold text-gray-color">
            {message.description}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default CalendarList
