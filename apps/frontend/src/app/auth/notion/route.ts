import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

import { BACKEND_URL, FRONTEND_URL } from "@/src/lib/constants/urls"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const redirectDomain = FRONTEND_URL

  if (!code) {
    console.error("No code received from Notion")
    return NextResponse.redirect(
      new URL("/login?error=no_code", redirectDomain)
    )
  }

  const cookies = request.cookies
  const session = cookies.get("__MARCH_ACCESS_TOKEN__")
  const token = session?.value

  try {
    const response = await axios.post(
      `${BACKEND_URL}/notion/getAccessToken`,
      {},
      {
        params: { code },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

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
    console.error("Error in Notion callback:", error)
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data)
    }
    return NextResponse.redirect(
      new URL("/login?error=notion_authentication_failed", redirectDomain)
    )
  }
}
