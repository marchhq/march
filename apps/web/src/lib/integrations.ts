import { User } from '@/types/user';
import { Github } from 'lucide-react';

export interface Integration {
  id: number;
  title: string;
  icon: string | typeof Github;
  iconType: 'image' | 'component';
  handler?: () => Promise<void>;
  isConnected?: boolean
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
  // Add other handlers as needed
}

export function getIntegrations(handlers: IntegrationHandlers, user: User): Integration[] {
  return [
    {
      id: 1,
      title: "Calendar",
      icon: "/icons/calendar.svg",
      iconType: "image",
      handler: user.integrations.googleCalendar.connected 
        ? handlers.calendarDisconnectHandler 
        : handlers.calendarConnectHandler,
      isConnected: user.integrations.googleCalendar.connected
    },
    { 
      id: 2, 
      title: "GitHub", 
      icon: Github, 
      iconType: "component",
      handler: user.integrations.github.connected
        ? handlers.githubDisconnectHandler
        : handlers.githubConnectHandler,
      isConnected: user.integrations.github.connected
    },
    {
      id: 3,
      title: "Gmail",
      icon: '/icons/gmail.svg', 
      iconType: "image",
      handler: user.integrations.gmail.connected
        ? handlers.gmailDisconnectHandler
        : handlers.gmailConnectHandler,
      isConnected: user.integrations.gmail.connected
    },
    {
      id: 4,
      title: "Linear",
      icon: '/icons/linear.svg',
      iconType: "image",
      handler: user.integrations.linear.connected
        ? handlers.linearDisconnectHandler
        : handlers.linearConnectHandler,
      isConnected: user.integrations.linear.connected
    }
    // Add more integrations here...
  ];
}