"use client"

import { Github } from "@/src/lib/icons/Github"

export const GithubLogin = (): JSX.Element => {
  return (
    <button className="flex w-96 items-center justify-center gap-x-6 rounded-2xl border border-button-stroke bg-transparent p-3.5 text-black font-semibold">
      <Github />
      <span className="pr-1">Continue with Github</span>
    </button>
  )
}
