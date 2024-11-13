"use client"

import { Icon } from "@iconify-icon/react"

import { Button } from "../button/Button"
import useGitHubLogin from "@/src/hooks/useGithubLogin"

export const GithubLogin = (): JSX.Element => {
  const handleLogin = useGitHubLogin()

  return (
    <Button onClick={handleLogin}>
      <Icon icon="ri:github-fill" className="text-[14px]" />
      <span className="pr-1">Continue with Github</span>
    </Button>
  )
}
