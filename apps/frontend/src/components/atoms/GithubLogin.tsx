"use client"

import useGitHubLogin from "@/src/hooks/useGithubLogin"
import { GithubDark } from "@/src/lib/icons/Github"

export const GithubLogin = (): JSX.Element => {
  const handleLogin = useGitHubLogin()

  return (
    <button
      onClick={handleLogin}
      className="flex w-96 items-center justify-center gap-x-6 bg-transparent p-3.5 font-semibold text-[#464748] hover:text-gray-100"
    >
      <GithubDark />
      <span className="pr-1">Continue with github</span>
    </button>
  )
}
