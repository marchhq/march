import React from 'react';
import { ChevronDown, ChevronRight } from "lucide-react";
import { Integration, User } from '@/src/lib/@types/auth/user';

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
  integrations: Integration[];
  handleLogin: () => void;
}

const Integrations: React.FC<IntegrationsProps> = ({ user, integrations, handleLogin }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4 text-foreground">Integrations</h3>
    <div className="space-y-4 -ml-8">
      {integrations.map((integration) => (
        <IntegrationItem
          key={integration.key}
          integration={integration}
          connected={user.integrations?.[integration.key]?.connected ?? false}
          onConnect={integration.key === "googleCalendar" ? handleLogin : () => {}}
        />
      ))}
    </div>
  </div>
);

export default Integrations;