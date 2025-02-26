import { getSession } from "@/actions/session"
import { BACKEND_URL, FRONTEND_URL } from "@/lib/constants"
import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const redirectDomain = FRONTEND_URL

  if (!code) {
    console.error("No code received from Google Calendar")
    return NextResponse.redirect(
      new URL("/login?error=no_code", redirectDomain)
    )
  }

  const session = await getSession()

  if (!session) {
    return NextResponse.redirect(
      new URL("/login?error=no_session", redirectDomain)
    )
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await axios.get(`${BACKEND_URL}/calendar/getAccessToken`, {
      params: { code },
      headers: {
        Authorization: `Bearer ${session}`,
      },
    })

    let redirectUrl = "/profile"
    if (state) {
      try {
        const stateData = JSON.parse(decodeURIComponent(state))
        if (stateData.redirect) {
          redirectUrl = stateData.redirect
        }
      } catch (error) {
        console.error("Error parsing state:", error)
      }
    }

    const res = NextResponse.redirect(new URL(redirectUrl, redirectDomain))
    return res
  } catch (error) {
    console.error("Error in Google Calendar callback:", error)
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data)
    }
    return NextResponse.redirect(
      new URL("/login?error=calendar_authentication_failed", redirectDomain)
    )
  }
}