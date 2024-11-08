import { useCallback } from "react"

import axios from "axios"
import { useRouter } from "next/navigation"

import { BACKEND_URL } from "../lib/constants/urls"

const useGitHubLogin = (session?: string) => {
  const router = useRouter()

  const handleLogin = useCallback(async () => {
    try {
      const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
      const GITHUB_SCOPE = "user:email"

      if (!GITHUB_CLIENT_ID) {
        throw new Error("GitHub Client ID is not set")
      }

      // const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&scope=${encodeURIComponent(GITHUB_SCOPE)}`
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=${GITHUB_SCOPE}`

      router.push(githubAuthUrl)
    } catch (error) {
      console.error("Failed to initiate GitHub login:", error)
    }
  }, [router])

  const handleRevoke = useCallback(async () => {
    try {
      await axios.delete(`${BACKEND_URL}/github/revoke-access/`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
    } catch (error) {
      console.error("Failed to revoke Github Installation: ", error)
      throw error
    }
  }, [session])

  return { handleLogin, handleRevoke }
}

export default useGitHubLogin
