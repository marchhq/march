import { useCallback } from "react"

import axios from "axios"
import { useRouter } from "next/navigation"

import { useAuth } from "../contexts/AuthContext"
import { BACKEND_URL, FRONTEND_URL } from "../lib/constants/urls"

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
      const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      const GOOGLE_SCOPE = "https://www.googleapis.com/auth/calendar"
      const GOOGLE_REDIRECT_URI = `${FRONTEND_URL}/auth/google-calendar`

      if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
        throw new Error("Google Client ID or Redirect URI is not set")
      }

      const state = encodeURIComponent(
        JSON.stringify({ redirect: redirectAfterAuth })
      )

      const calAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=${GOOGLE_SCOPE}&access_type=offline&state=${state}`
      router.push(calAuthUrl)
    } catch (error) {
      console.error("Failed to initiate Google Calendar login:", error)
    }
  }, [router, redirectAfterAuth])

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
