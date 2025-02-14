import { useCallback } from "react"

import axios from "axios"
import { useRouter } from "next/navigation"

import { useAuth } from "../contexts/AuthContext"
import { BACKEND_URL } from "../lib/constants/urls"
import useUserStore from "../lib/store/user.store"

interface GoogleCalendarHooks {
  handleLogin: () => Promise<void>
  handleRevoke: () => Promise<void>
}

const useGoogleCalendarLogin = (
  redirectAfterAuth: string
): GoogleCalendarHooks => {
  const router = useRouter()
  const { session } = useAuth()
  const { fetchUser } = useUserStore()

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
      // Refresh user data to update integration status
      await fetchUser(session)
      router.refresh()
    } catch (error) {
      console.error("Failed to revoke Google Calendar access:", error)
      throw error
    }
  }, [router, session, fetchUser])

  return { handleLogin, handleRevoke }
}

export default useGoogleCalendarLogin
