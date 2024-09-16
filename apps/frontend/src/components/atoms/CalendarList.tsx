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
    <ul className=" ml-24 flex w-fit flex-col items-start space-y-4">
      {" "}
      {/* Changed items-center to items-start */}
      {messages.map((message, index) => (
        <li key={index} className="flex items-center space-x-4">
          <span>
            <Check size={18} color="#464748" />
          </span>
          <span className="font-semibold text-gray-color">
            {message.description}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default CalendarList
