import React from "react"

import { ChevronDown, ChevronRight } from "lucide-react"

import { MagicCard } from "../magicui/magic-card"
import { GithubBordered } from "@/src/lib/icons/Github"
import { Gmail } from "@/src/lib/icons/Gmail"
import { Linear } from "@/src/lib/icons/Linear"
import { Notion } from "@/src/lib/icons/Notion"

const integrations = [
  {
    icon: <Gmail />,
    name: "Gmail",
    description:
      "Label emails as march comes directly to march Inbox as action items",
    connected: true,
  },
  {
    icon: <GithubBordered />,
    name: "Github",
    description:
      "Link your GitHub account to get all your assigned issues, Pull requests In march Inbox.",
    connected: false,
  },
  {
    icon: <Linear />,
    name: "Linear",
    description:
      "Link your Linear workspace to get all your assigned issues, Action items In march Inbox. Supports two-way sync.",
    connected: false,
  },
  {
    icon: <Notion />,
    name: "Notion",
    description:
      "Link your Notion Workspace to send database items from Notion to march or import existing database items.",
    connected: false,
  },
]

export const Integrations = () => {
  return (
    <MagicCard className="max-w-2xl shadow-xl">
      <div className="border-b border-gray-200 bg-[#EDEEF3] p-3 text-left text-black">
        Personal integrations
      </div>
      <ul className="divide-gray-[#C5C5C5] divide-y p-4 text-left">
        {integrations.map((integration, index) => (
          <li key={index} className="flex items-center py-3">
            <div className="flex grow items-center">
              <div className="mr-4">{integration.icon}</div>
              <div className="max-w-md grow">
                <p className="text-sm font-semibold text-black">
                  {integration.name}
                </p>
                <p className="text-sm text-gray-color">
                  {integration.description}
                </p>
              </div>
            </div>
            <div className="ml-4 shrink-0">
              {integration.connected ? (
                <button
                  className="flex items-center text-xs text-black"
                  disabled
                >
                  <span className="mr-1 size-1.5 rounded-full bg-green-500"></span>
                  Connected
                  <ChevronDown size={14} className="ml-1" />
                </button>
              ) : (
                <button className="flex items-center text-xs font-medium text-[#555DE4]">
                  <span className="mr-1">Connect</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </MagicCard>
  )
}
