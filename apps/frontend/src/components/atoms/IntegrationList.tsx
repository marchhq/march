"use client"
import { ChevronDown, ChevronRight } from "lucide-react"

import { useUserInfo } from "@/src/hooks/useUserInfo"
import { Cal } from "@/src/lib/icons/Calendar"
import { GithubDark } from "@/src/lib/icons/Github"
import { LinearDark } from "@/src/lib/icons/LinearCircle"
import { NotionDark } from "@/src/lib/icons/Notion"

const integrations = [
  {
    key: "googleCalendar",
    icon: <Cal />,
    name: "Google Calendar",
    description:
      "Link your Slack account to your Linear account and receive personal notification",
  },
  {
    key: "github",
    icon: <GithubDark />,
    name: "Github",
    description:
      "Link your Slack account to your Linear account and receive personal notification",
  },
  {
    key: "linear",
    icon: <LinearDark />,
    name: "Linear",
    description:
      "Link your Slack account to your Linear account and receive personal notification",
  },
  {
    key: "notion",
    icon: <NotionDark />,
    name: "Notion",
    description:
      "Link your Slack account to your Linear account and receive personal notification",
  },
]

export const IntegrationList = (): JSX.Element => {
  const user = useUserInfo()

  return (
    <div className=" space-y-4">
      {integrations.map((integration) => {
        const connected =
          user?.integrations?.[integration.key]?.connected ?? false

        return (
          <div
            key={integration.name}
            className="flex items-center justify-between text-white"
          >
            <div className="flex items-center space-x-4">
              <div className="flex size-10 items-center justify-center">
                {integration.icon}
              </div>
              <div className="max-w-lg">
                <h3 className="font-medium">{integration.name}</h3>
                <p className="text-sm text-gray-color">
                  {integration.description}
                </p>
              </div>
            </div>
            {connected ? (
              <button className="flex items-center">
                <div className="mr-2 size-1.5 rounded-full bg-green-500"></div>
                <span className="text-sm">Connected</span>
                <ChevronDown size={13} />
              </button>
            ) : (
              <button className="flex items-center text-sm">
                Connect
                <ChevronRight size={13} />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
