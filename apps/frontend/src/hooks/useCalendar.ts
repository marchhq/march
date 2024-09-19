import { useCallback } from "react"

import { useRouter } from "next/navigation"

import { FRONTEND_URL } from "../lib/constants/urls"

const useGoogleCalendarLogin = (): (() => Promise<void>) => {
  const router = useRouter()

  const handleLogin = useCallback(async () => {
    try {
      const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      const GOOGLE_SCOPE = "https://www.googleapis.com/auth/calendar"
      const GOOGLE_REDIRECT_URI = `${FRONTEND_URL}/auth/google`

      if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
        throw new Error("Google Client ID or Redirect URI is not set")
      }

      const calAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=${GOOGLE_SCOPE}&access_type=offline`

      router.push(calAuthUrl)
    } catch (error) {
      console.error("Failed to initiate Google Calendar login:", error)
    }
  }, [router])

  return handleLogin
}

export default useGoogleCalendarLogin
