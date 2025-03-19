import { Icons } from '@/components/ui/icons';
import { User } from '@/types/user';

export interface Integration {
  id: number;
  title: string;
  icon: keyof typeof Icons;
  handler?: () => Promise<void>;
  isConnected?: boolean;
}

interface IntegrationHandlers {
  calendarConnectHandler?: () => Promise<void>;
  calendarDisconnectHandler?: () => Promise<void>;
  githubConnectHandler?: () => Promise<void>;
  githubDisconnectHandler?: () => Promise<void>;
  gmailConnectHandler?: () => Promise<void>;
  gmailDisconnectHandler?: () => Promise<void>;
  linearConnectHandler?: () => Promise<void>;
  linearDisconnectHandler?: () => Promise<void>;
  xConnectHandler?: () => Promise<void>;
  xDisconnectHandler?: () => Promise<void>;
  // Add other handlers as needed
}

export function getIntegrations(handlers: IntegrationHandlers, user: User): Integration[] {
  return [
    {
      id: 1,
      title: "Calendar",
      icon: "calendar",
      handler: user.integrations.googleCalendar.connected 
        ? handlers.calendarDisconnectHandler 
        : handlers.calendarConnectHandler,
      isConnected: user.integrations.googleCalendar.connected
    },
    { 
      id: 2, 
      title: "GitHub", 
      icon: "gitHub",
      handler: user.integrations.github.connected
        ? handlers.githubDisconnectHandler
        : handlers.githubConnectHandler,
      isConnected: user.integrations.github.connected
    },
    {
      id: 3,
      title: "Gmail",
      icon: "gmail",
      handler: user.integrations.gmail.connected
        ? handlers.gmailDisconnectHandler
        : handlers.gmailConnectHandler,
      isConnected: user.integrations.gmail.connected
    },
    {
      id: 4,
      title: "Linear",
      icon: "linear",
      handler: user.integrations.linear.connected
        ? handlers.linearDisconnectHandler
        : handlers.linearConnectHandler,
      isConnected: user.integrations.linear.connected
    },
    {
      id: 5,
      title: "X",
      icon: "twitter",
      handler: user.integrations?.x?.connected
        ? handlers.xDisconnectHandler
        : handlers.xConnectHandler,
      isConnected: user.integrations?.x?.connected
    }
    // Add more integrations here...
  ];
}