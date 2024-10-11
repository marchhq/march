import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

import { LINEAR_ACCESS_TOKEN } from "@/src/lib/constants/cookie"
import { BACKEND_URL } from "@/src/lib/constants/urls"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  if (!code) {
    console.error("No code received from Linear")
    return NextResponse.redirect(new URL("/login?error=no_code", request.url))
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

    const { accessToken } = response.data

    const res = NextResponse.redirect(new URL("/profile", request.url))
    res.cookies.set(LINEAR_ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    return res
  } catch (error) {
    console.error("Error in Linear callback:", error)
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data)
    }
    return NextResponse.redirect(
      new URL("/login?error=linear_authentication_failed", request.url)
    )
  }
}
