import React, { useState } from "react";
import { Button } from "@/components/ui/button";
// import { Github, Calendar } from "lucide-react";
import Image from "next/image";
import useGoogleCalendarLogin from "@/hooks/use-calendar-login";
import { getIntegrations, Integration } from "@/lib/integrations";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import useGmail from "@/hooks/use-gmail-login";
import { useLinearLogin } from "@/hooks/use-linear-login";
import { useGithubInstall } from "@/hooks/use-github-install";

const IntegrationsList = () => {
  const [isDisconnecting, setIsDisconnecting] = useState<number | null>(null);
  const { data: user, refreshUser } = useUser();
  const { handleCalendarLogin, handleRevokeAccess } =
    useGoogleCalendarLogin("/agenda");
  const { handleGmailLogin } = useGmail("/agenda");
  const { handleLinearLogin } = useLinearLogin("/agenda");
  const { handleGithubInstall } = useGithubInstall();
  if (!user) {
    return null;
  }

  const integrations = getIntegrations(
    {
      calendarConnectHandler: handleCalendarLogin,
      calendarDisconnectHandler: handleRevokeAccess,
      gmailConnectHandler: handleGmailLogin,
      linearConnectHandler: handleLinearLogin,
      githubConnectHandler: handleGithubInstall,
    },
    user
  );

  const handleIntegrationAction = async (integration: Integration) => {
    if (!integration.handler) return;

    if (integration.isConnected) {
      setIsDisconnecting(integration.id);
      try {
        await integration.handler();
        await refreshUser();
        toast.success(`${integration.title} removed successfully`);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to remove integration");
      } finally {
        setIsDisconnecting(null);
      }
    } else {
      await integration.handler();
      toast.success(`${integration.title} is connected to emptyarray!`);
    }
  };

  const renderIcon = (integration: Integration) => {
    if (
      integration.iconType === "component" &&
      typeof integration.icon !== "string"
    ) {
      const IconComponent = integration.icon;
      return <IconComponent className="h-5 w-5" />;
    } else if (
      integration.iconType === "image" &&
      typeof integration.icon === "string"
    ) {
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
            onClick={() => handleIntegrationAction(integration)}
            disabled={isDisconnecting === integration.id}
            className="w-20 h-7"
          >
            {isDisconnecting === integration.id ? (
              <Spinner />
            ) : integration.isConnected ? (
              "Remove"
            ) : (
              "Add"
            )}
          </Button>
        </div>
      ))}
    </>
  );
};

export default IntegrationsList;
