<<<<<<< HEAD
<<<<<<< HEAD
"use client"

import useGitHubLogin from "@/src/hooks/useGithubLogin"
import { Github } from "@/src/lib/icons/Github"

export const GithubLogin = (): JSX.Element => {
  const handleLogin = useGitHubLogin()

  return (
    <button
      onClick={handleLogin}
      className="flex w-96 items-center justify-center gap-x-6 rounded-2xl border border-button-stroke bg-transparent p-3 font-semibold text-black"
    >
      <Github />
      <span className="pr-1">Continue with github</span>
=======
=======
>>>>>>> 1cbb6a173a688ea32842d4f7155a8cfa45f8c94a
import { Github } from "@/src/lib/icons/Github"

export const GithubLogin = (): JSX.Element => {
  return (
    <button className="flex w-96 items-center justify-center gap-x-6 rounded-2xl border border-button-stroke bg-transparent p-3.5 text-black font-semibold">
      <Github />
      <span className="pr-1">Continue with Github</span>
<<<<<<< HEAD
>>>>>>> 1cbb6a1 (added onboarding ui)
=======
>>>>>>> 1cbb6a173a688ea32842d4f7155a8cfa45f8c94a
    </button>
  )
}