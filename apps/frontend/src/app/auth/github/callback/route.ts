import { NextRequest, NextResponse } from "next/server"

import { BACKEND_URL, FRONTEND_URL } from "@/src/lib/constants/urls"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const redirectDomain = FRONTEND_URL

  const installation_id = searchParams.get("installation_id")
  if (!installation_id) {
    return NextResponse.json(
      { message: "Missing installation_id parameter" },
      { status: 400 }
    )
  }
  const cookies = request.cookies
  const session = cookies.get("__MARCH_ACCESS_TOKEN__")
  const token = session?.value

  if (!token) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    )
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/github/callback?installation_id=${installation_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (response.ok) {
      const res = NextResponse.redirect(new URL("/profile", redirectDomain))
      return res
    } else {
      // Handle non-200 responses
      const errorData = await response.json()
      console.error("GitHub callback error:", errorData)
      return NextResponse.json(
        { error: errorData.message || "Error fetching data" },
        { status: response.status }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
