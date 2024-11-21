import { useMemo } from "react"

import { StackItems } from "./stack-items"
import useGoogleCalendarLogin from "@/src/hooks/useCalendar"
import installGitHub from "@/src/hooks/useInstallGitHub"
import useLinear from "@/src/hooks/useLinear"
import { Integration } from "@/src/lib/@types/auth/user"
import { Cal } from "@/src/lib/icons/Calendar"
import { GithubDark } from "@/src/lib/icons/Github"
import { LinearDark } from "@/src/lib/icons/LinearCircle"

export const Stack = ({ user }): JSX.Element => {
  const { handleLogin: handleCalLogin, handleRevoke: handleCalRevoke } =
    useGoogleCalendarLogin("/stack")
  const { handleLogin: handleLinearLogin } = useLinear()

  const integrations: Integration[] = useMemo(
    () => [
      {
        key: "googleCalendar",
        icon: <Cal />,
        name: "Calendar",
        description: "Sync your daily agenda with march",
        handleConnect: handleCalLogin,
        handleRevoke: handleCalRevoke,
      },
      {
        key: "github",
        icon: <GithubDark />,
        name: "Github",
        description: "Sync assigned issues, Pulls with march today",
        handleConnect: installGitHub,
        handleRevoke: () => console.log("Github revoke not implemented yet"),
      },
      {
        key: "linear",
        icon: <LinearDark />,
        name: "Linear",
        description: "Sync your linear action items with march",
        handleConnect: handleLinearLogin,
        handleRevoke: () => console.log("Linear revoke not implemented yet"),
      },
    ],
    [handleCalLogin, handleCalRevoke, handleLinearLogin]
  )
  return (
    <div className="flex gap-4">
      {integrations.map((integration) => (
        <StackItems
          key={integration.key}
          integration={integration}
          connected={user.integrations?.[integration.key]?.connected ?? false}
          onConnect={integration.handleConnect}
        />
      ))}
    </div>
  )
}
