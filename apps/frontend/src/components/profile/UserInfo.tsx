"use client"
import React from "react"

import Image from "next/image"

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
    <div className="mb-8 flex flex-col">
      {user.avatar && (
        <Image
          src={user.avatar}
          alt={`${user.fullName}'s Avatar`}
          width={32}
          height={32}
          priority
          className="mb-4 size-8 rounded-full border-2 border-secondary-foreground"
        />
      )}
      <h2 className="mb-1 text-[16px] font-semibold text-foreground">
        {user.fullName || "Anonymous User"}
      </h2>
      <p className="mb-4 text-xs text-secondary-foreground">{email}</p>
      <div className="flex items-center text-base text-secondary-foreground">
        <span className="mr-2 text-[13px]">Logged in with {authMethod}</span>
        {icon}
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-secondary-foreground">
        <p className="text-[13px]">Interface</p>
        <span className="size-[3px] rounded-full bg-secondary-foreground"></span>{" "}
        <button className="text-[13px] hover:underline">Light</button>
      </div>
    </div>
  )
}

export default UserInfo
