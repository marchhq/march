import { useCallback } from "react"

import axios from "axios"
import { useRouter } from "next/navigation"

import { useAuth } from "../contexts/AuthContext"
import { BACKEND_URL } from "../lib/constants/urls"

interface GoogleCalendarHooks {
  handleLogin: () => Promise<void>
  handleRevoke: () => Promise<void>
}

const useGoogleCalendarLogin = (
  redirectAfterAuth: string
): GoogleCalendarHooks => {
  const router = useRouter()
  const { session } = useAuth()

  const handleLogin = useCallback(async () => {
    try {
      const response = await axios.get(`/api/auth/google-calendar/url`, {
        params: { redirectAfterAuth },
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })

      const { authUrl } = response.data
      router.push(authUrl)
    } catch (error) {
      console.error("Failed to initiate Google Calendar login:", error)
    }
  }, [router, redirectAfterAuth, session])

  const handleRevoke = useCallback(async () => {
    try {
      await axios.get(`${BACKEND_URL}/calendar/revoke-access/`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
      router.push(redirectAfterAuth)
    } catch (error) {
      console.error("Failed to revoke Google Calendar access:", error)
      throw error
    }
  }, [router, redirectAfterAuth, session])

  return { handleLogin, handleRevoke }
}

export default useGoogleCalendarLogin
