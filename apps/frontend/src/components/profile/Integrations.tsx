import React, { useMemo } from "react"

import { ChevronDown, ChevronRight } from "lucide-react"

import useGoogleCalendarLogin from "@/src/hooks/useCalendar"
import useLinear from "@/src/hooks/useLinear"
import { IntegrationType, User } from "@/src/lib/@types/auth/user"
import { Cal } from "@/src/lib/icons/Calendar"
import { GithubDark } from "@/src/lib/icons/Github"
import { LinearDark } from "@/src/lib/icons/LinearCircle"
import { NotionDark } from "@/src/lib/icons/Notion"
import useGithubLogin from "@/src/hooks/useGithubLogin"

interface IntegrationItemProps {
  integration: Integration
  connected: boolean
  onConnect: () => void
}

const IntegrationItem: React.FC<IntegrationItemProps> = ({
  integration,
  connected,
  onConnect,
}) => (
  <div className="flex items-center justify-between rounded-lg py-4 text-foreground">
    <div className="flex items-center space-x-4">
      <div className="flex items-center justify-center size-5">
        {integration.icon}
      </div>
      <div className="max-w-md">
        <h4 className="text-[13px] font-medium">{integration.name}</h4>
        <p className="text-[13px] text-secondary-foreground">
          {integration.description}
        </p>
      </div>
    </div>
    {connected ? (
      <button className="flex items-center text-secondary-foreground">
        <div className="mr-2 rounded-full bg-green-500 size-1.5"></div>
        <span className="text-[13px]">Connected</span>
        <ChevronDown size={13} />
      </button>
    ) : (
      <button
        onClick={onConnect}
        className="flex items-center rounded-md bg-primary px-4 py-2 text-[13px] text-primary-foreground"
      >
        Connect
        <ChevronRight size={13} className="ml-1" />
      </button>
    )}
  </div>
)

interface IntegrationsProps {
  user: User
}

export interface Integration {
  key: IntegrationType
  icon: JSX.Element
  name: string
  description: string
  handleConnect: () => void
}

const Integrations: React.FC<IntegrationsProps> = ({ user }) => {
  const handleGoogleCalendarLogin = useGoogleCalendarLogin("/profile")
  const { handleLogin: handleLinearLogin } = useLinear()
  const handleGitHubLogin = useGithubLogin()
  const integrations: Integration[] = useMemo(
    () => [
      {
        key: "googleCalendar",
        icon: <Cal />,
        name: "Google Calendar",
        description:
          "Link your Google Calendar to manage, create, and view events without leaving the app.",
        handleConnect: handleGoogleCalendarLogin,
      },
      {
        key: "github",
        icon: <GithubDark />,
        name: "Github",
        description:
          "Connect your GitHub account to access repositories and manage issues.",
        handleConnect:handleGitHubLogin
      },
      {
        key: "linear",
        icon: <LinearDark />,
        name: "Linear",
        description:
          "Integrate Linear to track and manage your project tasks and issues.",
        handleConnect: handleLinearLogin,
      },
      {
        key: "notion",
        icon: <NotionDark />,
        name: "Notion",
        description:
          "Link your Notion workspace to access and edit your documents seamlessly.",
        handleConnect: () =>
          console.log("Notion connection not implemented yet"),
      },
    ],
    [handleGoogleCalendarLogin, handleLinearLogin,handleGitHubLogin]
  )

  return (
    <div className="mb-8">
      <h3 className="mb-4 text-xl font-semibold text-foreground">
        Integrations
      </h3>
      <div className="-ml-8 space-y-4">
        {integrations.map((integration) => (
          <IntegrationItem
            key={integration.key}
            integration={integration}
            connected={user.integrations?.[integration.key]?.connected ?? false}
            onConnect={integration.handleConnect}
          />
        ))}
      </div>
    </div>
  )
}

export default Integrations
