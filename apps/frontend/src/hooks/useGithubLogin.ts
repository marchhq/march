import { useCallback } from "react"

import { useRouter } from "next/navigation"

const useGitHubLogin = (): (() => Promise<void>) => {
  const router = useRouter()

  const handleLogin = useCallback(async () => {
    try {
      const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
      //FIX: need redirect uri 
      const GITHUB_REDIRECT_URI = 
      const GITHUB_SCOPE = "read:user user:email"

      if (!GITHUB_CLIENT_ID) {
        throw new Error("GitHub Client ID is not set")
      }

      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&scope=${encodeURIComponent(GITHUB_SCOPE)}`

      router.push(githubAuthUrl)
    } catch (error) {
      console.error("Failed to initiate GitHub login:", error)
    }
  }, [router])

  return handleLogin
}

export default useGitHubLogin
