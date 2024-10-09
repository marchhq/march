import axios, { type AxiosError } from "axios"
import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"

import { type GoogleAuthResponse } from "@/src/lib/@types/auth/response"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/src/lib/constants/cookie"
import { BACKEND_URL } from "@/src/lib/constants/urls"

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams
  const encodedCode = searchParams.get("code")
  if (encodedCode == null) {
    return NextResponse.redirect(new URL("/", request.url))
  }
  const code = decodeURIComponent(encodedCode)
  let res: GoogleAuthResponse
  try {
    const { data } = await axios.post(
      `${BACKEND_URL}/auth/google/login`,
      null,
      {
        headers: {
          "x-google-auth": code,
        },
      }
    )
    res = data as GoogleAuthResponse
    console.log(res)
  } catch (error) {
    const e = error as AxiosError
    if (e.response?.status === 401) {
      console.error("Google auth error: ", e.response.data)
    } else {
      console.error("Google auth error: ", e.cause)
    }
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (!res.accessToken) {
    console.error("Access token is missing from the response")
    return NextResponse.redirect(new URL("/", request.url))
  }

  const response = NextResponse.redirect(
    new URL(res.isNewUser ? "/calendar" : "/today", request.url)
  )

  response.cookies.set(ACCESS_TOKEN, res.accessToken, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  })

  response.cookies.set(REFRESH_TOKEN, res.refreshToken, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  })

  console.log("cookie was set")

  return response
}
