import React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { MagicCard } from "../magicui/magic-card"
import { Linear } from "@/src/lib/icons/Linear"
import { Notion } from "@/src/lib/icons/Notion"
import { GithubBordered } from "@/src/lib/icons/Github"
import { Gmail } from "@/src/lib/icons/Gmail"

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
      <div className="border-b border-gray-200 text-black text-left bg-[#EDEEF3] p-3">
        Personal integrations
      </div>
      <ul className="text-left divide-y divide-gray-[#C5C5C5] p-4">
        {integrations.map((integration, index) => (
          <li key={index} className="flex items-center py-3">
            <div className="flex items-center flex-grow">
              <div className="mr-4">{integration.icon}</div>
              <div className="flex-grow max-w-md">
                <p className="text-sm font-semibold text-black">
                  {integration.name}
                </p>
                <p className="text-gray-color text-sm">
                  {integration.description}
                </p>
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              {integration.connected ? (
                <button
                  className="text-black text-xs flex items-center"
                  disabled
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></span>
                  Connected
                  <ChevronDown size={14} className="ml-1" />
                </button>
              ) : (
                <button className="text-[#555DE4] text-xs font-medium flex items-center">
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
