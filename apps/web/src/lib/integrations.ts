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
  calendarHandler?: () => Promise<void>;
  githubHandler?: () => Promise<void>;
  // Add other handlers as needed
}

export function getIntegrations(handlers: IntegrationHandlers, user: User): Integration[] {
  return [
    {
      id: 1,
      title: "Calendar",
      icon: "/icons/calendar.svg",
      iconType: "image",
      handler: handlers.calendarHandler,
      isConnected: user.integrations.googleCalendar.connected
    },
    { 
      id: 2, 
      title: "GitHub", 
      icon: Github, 
      iconType: "component",
      handler: handlers.githubHandler,
      isConnected: user.integrations.github.connected
    },
    // Add more integrations here...
  ];
}