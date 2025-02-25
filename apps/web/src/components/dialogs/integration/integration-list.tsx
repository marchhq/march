import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Github, Calendar } from "lucide-react";
import Image from "next/image";
import useGoogleCalendarLogin from "@/hooks/use-calendar-login";
import { getIntegrations, Integration } from "@/lib/integrations";
import { useUser } from "@/hooks/use-user";

const IntegrationsList = () => {
  const { data: user } = useUser();
  const { handleCalendarLogin, handleRevokeAccess } =
    useGoogleCalendarLogin("/today");

  if (!user) {
    return null;
  }

  const integrations = getIntegrations(
    {
      calendarConnectHandler: handleCalendarLogin,
      calendarDisconnectHandler: handleRevokeAccess,
    },
    user
  );

  const renderIcon = (integration: Integration) => {
    if (integration.iconType === "component") {
      const IconComponent = integration.icon;
      return <IconComponent className="h-5 w-5" />;
    } else if (integration.iconType === "image") {
      return (
        <Image
          src={integration.icon}
          alt={`${integration.title} icon`}
          width={20}
          height={20}
        />
      );
    }
    return null;
  };

  return (
    <>
      {integrations.map((integration) => (
        <div key={integration.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {renderIcon(integration)}
            <span>{integration.title}</span>
          </div>
          <Button
            variant={integration.isConnected ? "default" : "outline"}
            size="sm"
            onClick={integration.handler}
          >
            {integration.isConnected ? "Remove" : "Add"}
          </Button>
        </div>
      ))}
    </>
  );
};

export default IntegrationsList;
