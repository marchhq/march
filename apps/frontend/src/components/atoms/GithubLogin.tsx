"use client"

import { Icon } from "@iconify-icon/react"

import useGitHubLogin from "@/src/hooks/useGithubLogin"

export const GithubLogin = (): JSX.Element => {
  const handleLogin = useGitHubLogin()

  return (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center gap-2 bg-transparent w-fit p-1 font-semibold text-secondary-foreground hover-text"
    >
      <Icon icon="ri:github-fill" className="text-[20px]" />
      <span className="pr-1">continue with github</span>
    </button>
  )
}
