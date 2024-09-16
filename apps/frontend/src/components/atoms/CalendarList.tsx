import React from "react"

import { Check } from "lucide-react"

import { MagicCard } from "../magicui/magic-card"

const messages = [
  {
    description: "get a view of your daily agenda inside march today",
  },
  {
    description: "time box action items by drag and drop.",
  },
  {
    description: "create and manage events effortlessly",
  },
]

const CalendarList = (): JSX.Element => {
  return (
    <MagicCard className="p-10 shadow-lg">
      <ul className="text-left divide-y divide-gray-200">
        {messages.map((message, index) => (
          <li key={index} className="flex items-center space-x-4">
            <span>
              <Check size={16} color="#917ee7" />
            </span>
            <span className="mt-4 mb-4 text-gray-color">
              {message.description}
            </span>
          </li>
        ))}
      </ul>
    </MagicCard>
  )
}

export default CalendarList
