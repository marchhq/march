import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { FRONTEND_URL } from "@/lib/constants"
import { apiClient } from "@/lib/api"

const useGoogleCalendar = (
  redirectAfterAuth: string,
  redirectAfterRevoke: string = redirectAfterAuth 
): {
  handleCalendarLogin: () => Promise<void>,
  handleRevokeAccess: () => Promise<void>
} => {
  const router = useRouter()
  
  const handleCalendarLogin = useCallback(async () => {
    try {
      const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      const GOOGLE_SCOPE = "https://www.googleapis.com/auth/calendar"
      const GOOGLE_REDIRECT_URI = `${FRONTEND_URL}/api/auth/google-calendar`
      
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
  
  const handleRevokeAccess = useCallback(async () => {
    try {
      const response = await apiClient.get("/calendar/revoke-access/")
      
      if (!response) {
        throw new Error(`Failed to revoke access`)
      }
      
      router.push(redirectAfterRevoke)
    } catch (error) {
      console.error("Failed to revoke Google Calendar access:", error)
    }
  }, [router, redirectAfterRevoke])
  
  return { handleCalendarLogin, handleRevokeAccess }
}

export default useGoogleCalendar