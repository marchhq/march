import React, { useMemo } from 'react';
import { ChevronDown, ChevronRight } from "lucide-react";
import { Integration, User } from '@/src/lib/@types/auth/user';
import useGoogleCalendarLogin from "@/src/hooks/useCalendar";
import { Cal } from "@/src/lib/icons/Calendar";
import { GithubDark } from "@/src/lib/icons/Github";
import { LinearDark } from "@/src/lib/icons/LinearCircle";
import { NotionDark } from "@/src/lib/icons/Notion";

interface IntegrationItemProps {
  integration: Integration;
  connected: boolean;
  onConnect: () => void;
}

const IntegrationItem: React.FC<IntegrationItemProps> = ({ integration, connected, onConnect }) => (
  <div className="flex items-center justify-between text-foreground py-4 rounded-lg">
    <div className="flex items-center space-x-4">
      <div className="flex size-5 items-center justify-center">
        {integration.icon}
      </div>
      <div className="max-w-lg">
        <h4 className="font-medium">{integration.name}</h4>
        <p className="text-sm text-secondary-foreground">
          {integration.description}
        </p>
      </div>
    </div>
    {connected ? (
      <button className="flex items-center text-secondary-foreground">
        <div className="mr-2 size-1.5 rounded-full bg-green-500"></div>
        <span className="text-sm">Connected</span>
        <ChevronDown size={13} />
      </button>
    ) : (
      <button
        onClick={onConnect}
        className="flex items-center text-sm text-primary-foreground bg-primary px-4 py-2 rounded-md"
      >
        Connect
        <ChevronRight size={13} className="ml-1" />
      </button>
    )}
  </div>
);

interface IntegrationsProps {
  user: User;
}

const Integrations: React.FC<IntegrationsProps> = ({ user }) => {
  const handleGoogleCalendarLogin = useGoogleCalendarLogin('/profile');

  const integrations: Integration[] = useMemo(() => [
    {
      key: "googleCalendar",
      icon: <Cal />,
      name: "Google Calendar",
      description:
        "Link your Google Calendar to manage, create, and view events without leaving the app.",
    },
    {
      key: "github",
      icon: <GithubDark />,
      name: "Github",
      description:
        "Connect your GitHub account to access repositories and manage issues.",
    },
    {
      key: "linear",
      icon: <LinearDark />,
      name: "Linear",
      description:
        "Integrate Linear to track and manage your project tasks and issues.",
    },
    {
      key: "notion",
      icon: <NotionDark />,
      name: "Notion",
      description:
        "Link your Notion workspace to access and edit your documents seamlessly.",
    },
  ], []);

  const handleConnect = (key: string) => {
    switch (key) {
      case "googleCalendar":
        handleGoogleCalendarLogin();
        break;
      // Add cases for other integrations in the future
      default:
        console.log(`Connect functionality not implemented for ${key}`);
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-foreground">Integrations</h3>
      <div className="space-y-4 -ml-8">
        {integrations.map((integration) => (
          <IntegrationItem
            key={integration.key}
            integration={integration}
            connected={user.integrations?.[integration.key]?.connected ?? false}
            onConnect={() => handleConnect(integration.key)}
          />
        ))}
      </div>
    </div>
  );
};

export default Integrations;