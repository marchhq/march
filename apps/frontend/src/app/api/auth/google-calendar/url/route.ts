import { NextRequest, NextResponse } from "next/server"

import { FRONTEND_URL } from "@/src/lib/constants/urls"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const redirectAfterAuth = searchParams.get("redirectAfterAuth")

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const GOOGLE_SCOPE = "https://www.googleapis.com/auth/calendar"
  const GOOGLE_REDIRECT_URI = `${FRONTEND_URL}/auth/google-calendar`

  if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
    return NextResponse.json(
      {
        error: "configuration error",
      },
      {
        status: 500,
      }
    )
  }

  const state = encodeURIComponent(
    JSON.stringify({ redirect: redirectAfterAuth })
  )

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=${GOOGLE_SCOPE}&access_type=offline&state=${state}`

  return NextResponse.json({ authUrl })
}
