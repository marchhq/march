"use client"

import { Icon } from "@iconify-icon/react"

import useGitHubLogin from "@/src/hooks/useGithubLogin"

export const GithubLogin = (): JSX.Element => {
  const { handleLogin } = useGitHubLogin()

  return (
    <button
      onClick={handleLogin}
      className="hover-text flex w-fit items-center justify-center gap-2 bg-transparent p-1 font-semibold text-secondary-foreground"
    >
      <Icon icon="ri:github-fill" className="text-[20px]" />
      <span className="pr-1">continue with github</span>
    </button>
  )
}
