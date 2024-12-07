import { useCallback } from "react"

import axios from "axios"
import { useRouter } from "next/navigation"

import { BACKEND_URL } from "../lib/constants/urls"

const useGitHubLogin = (session?: string) => {
  const router = useRouter()

  const handleLogin = useCallback(async () => {
    try {
      const response = await axios.get(`/api/auth/github/url`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })

      const { authUrl } = response.data
      router.push(authUrl)
    } catch (error) {
      console.error("Failed to initiate GitHub login:", error)
    }
  }, [router, session])

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
