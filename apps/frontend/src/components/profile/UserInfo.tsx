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
    <div>
      <div className="flex items-center space-x-3">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={`${user.fullName}'s Avatar`}
            width={40}
            height={40}
            priority
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Icon name="User" className="w-5 h-5 text-gray-500" />
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-gray-900">
            {user.fullName || "Anonymous User"}
          </h3>
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <span className="mr-2">{email}</span>
            <span className="text-gray-300">•</span>
            <div className="ml-2 flex items-center">
              {icon}
              <span className="ml-1">{authMethod}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo
