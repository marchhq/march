"use client"

import React, { useEffect, useMemo } from 'react';
import { useAuth } from "@/src/contexts/AuthContext";
import useUserStore from "@/src/lib/store/user.store";
import useGoogleCalendarLogin from "@/src/hooks/useCalendar";
import UserInfo from '@/src/components/profile/UserInfo';
import Integrations from '@/src/components/profile/Integrations';
import { Cal } from "@/src/lib/icons/Calendar";
import { GithubDark } from "@/src/lib/icons/Github";
import { LinearDark } from "@/src/lib/icons/LinearCircle";
import { NotionDark } from "@/src/lib/icons/Notion";
import { type Integration } from '@/src/lib/@types/auth/user';

const ProfilePage: React.FC = () => {
  const { session } = useAuth();
  const { user, isLoading, error, fetchUser } = useUserStore();
  const handleLogin = useGoogleCalendarLogin('/profile');

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

  useEffect(() => {
    if (session) {
      fetchUser(session);
    }
  }, [session, fetchUser]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="p-6 pt-16 bg-background text-foreground w-1/2 ml-[15%]">
      <UserInfo user={user} />
      <Integrations user={user} integrations={integrations} handleLogin={handleLogin} />
      <footer className="text-lg text-muted-foreground mt-24">
        <p className="font-semibold mb-2">march 0.1</p>
        <p className="text-sm text-secondary-foreground">— crafted for the makers to <span className="font-bold">get things done</span>;</p>
      </footer>
    </div>
  );
};

export default ProfilePage;