import { ChevronDown, ChevronRight } from "lucide-react"

import { GithubDark } from "@/src/lib/icons/Github"
import { GmailDark } from "@/src/lib/icons/Gmail"

const integrations = [
  {
    icon: <GmailDark />,
    name: "Google Calendar",
    description:
      "Link your Slack account to your Linear account and receive personal notification",
    connected: true,
  },
  {
    icon: <GithubDark />,
    name: "Github",
    description:
      "Link your Slack account to your Linear account and receive personal notification",
    connected: false,
  },
]

export const IntegrationList = (): JSX.Element => {
  return (
    <div className="space-y-4">
      {integrations.map((integration) => (
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
          {integration.connected ? (
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
      ))}
    </div>
  )
}
