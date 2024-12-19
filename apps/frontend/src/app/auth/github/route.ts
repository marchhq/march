import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/src/lib/constants/cookie"
import { BACKEND_URL, FRONTEND_URL } from "@/src/lib/constants/urls"

// Handle the GitHub callback and set cookies
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const redirectDomain = FRONTEND_URL

  if (!code) {
    console.error("No code received from GitHub")
    return NextResponse.redirect(
      new URL("/login?error=no_code", redirectDomain)
    )
  }

  try {
    const response = await axios.get(`${BACKEND_URL}/auth/github/login`, {
      params: { code },
    })

    const { accessToken, refreshToken, isNewUser } = response.data

    const res = NextResponse.redirect(
      // redirecting to inbox for test
      isNewUser
        ? new URL("/calendar", redirectDomain)
        : new URL("/today", redirectDomain)
    )

    res.cookies.set(ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    res.cookies.set(REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    return res
  } catch (error) {
    console.error("Error during GitHub authentication:", error)
    return NextResponse.redirect(
      new URL("/login?error=authentication_failed", redirectDomain)
    )
  }
}
