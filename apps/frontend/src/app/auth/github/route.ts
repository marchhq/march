import axios, { type AxiosError } from "axios"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { type NextResponse, type NextRequest } from "next/server"

import { type GitHubAuthResponse } from "@/src/lib/@types/auth/response"
import { ACCESS_TOKEN } from "@/src/lib/constants/cookie"
import { BACKEND_URL } from "@/src/lib/constants/urls"

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  if (code == null) {
    return redirect("/")
  }

  let res: GitHubAuthResponse
  try {
    const { data } = await axios.post(
      `${BACKEND_URL}/auth/github/login`,
      { code },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    res = data as GitHubAuthResponse
    console.log(res)
  } catch (error) {
    const e = error as AxiosError
    if (e.response?.status === 401) {
      console.error(e.response.data)
    } else {
      console.error(e.cause)
    }
    return redirect("/")
  }

  cookies().set(ACCESS_TOKEN, res.accessToken, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  })
  console.log("cookie was set")
  return redirect("/app/today")
}
