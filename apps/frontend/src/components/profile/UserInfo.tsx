import React from "react"

import { Icon } from "@/src/components/Icon"
import { User } from "@/src/lib/@types/auth/user"
import { GithubDark } from "@/src/lib/icons/Github"
import Google from "@/src/lib/icons/Google"

export const getAuthInfo = (
  user: User
): { authMethod: string; email: string; icon: JSX.Element } => {
  if (user.accounts?.google?.email) {
    return {
      authMethod: "Google",
      email: user.accounts.google.email,
      icon: <Google />,
    }
  }
  if (user.accounts?.github?.email) {
    return {
      authMethod: "GitHub",
      email: user.accounts.github.email,
      icon: <GithubDark />,
    }
  }
  if (user.accounts?.local?.email) {
    return {
      authMethod: "Email",
      email: user.accounts.local.email,
      icon: <Icon name="Mail" />,
    }
  }
  return {
    authMethod: "Unknown",
    email: "No email provided",
    icon: <Icon name="User" />,
  }
}

interface UserInfoProps {
  user: User
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const { authMethod, email, icon } = getAuthInfo(user)

  return (
    <div className="flex flex-col mb-8">
      {user.avatar && (
        <img
          src={user.avatar}
          alt={`${user.fullName}'s Avatar`}
          className="w-8 h-8 rounded-full mb-4 border-2 border-secondary-foreground"
        />
      )}
      <h2 className="text-[16px] font-semibold text-foreground mb-1">
        {user.fullName || "Anonymous User"}
      </h2>
      <p className="text-xs text-secondary-foreground mb-4">{email}</p>
      <div className="flex items-center text-md text-secondary-foreground">
        <span className="mr-2 text-[13px]">Logged in with {authMethod}</span>
        {icon}
      </div>
    </div>
  )
}

export default UserInfo
