import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

import { BACKEND_URL, FRONTEND_URL } from "@/src/lib/constants/urls"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const redirectDomain = FRONTEND_URL

  if (!code) {
    console.error("No code received from Linear")
    return NextResponse.redirect(
      new URL("/login?error=no_code", redirectDomain)
    )
  }

  const cookies = request.cookies
  const session = cookies.get("__MARCH_ACCESS_TOKEN__")
  const token = session?.value

  try {
    const response = await axios.get(`${BACKEND_URL}/linear/getAccessToken`, {
      params: { code },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const res = NextResponse.redirect(new URL("/profile", redirectDomain))

    return res
  } catch (error) {
    console.error("Error in Linear callback:", error)
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data)
    }
    return NextResponse.redirect(
      new URL("/login?error=linear_authentication_failed", redirectDomain)
    )
  }
}
