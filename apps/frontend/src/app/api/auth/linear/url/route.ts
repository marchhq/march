import { NextResponse } from "next/server"

export async function GET() {
  const scope = "read write"
  const LINEAR_CLIENT_ID = process.env.LINEAR_CLIENT_ID
  const LINEAR_REDIRECT_URL = process.env.LINEAR_REDIRECT_URL
  const LINEAR_SCOPE = encodeURIComponent(scope)

  if (!LINEAR_CLIENT_ID || !LINEAR_REDIRECT_URL) {
    return NextResponse.json(
      {
        error: "linear client_id or redirect_url is not set",
      },
      {
        status: 500,
      }
    )
  }

  const authUrl = `https://linear.app/oauth/authorize?client_id=${LINEAR_CLIENT_ID}&redirect_uri=${LINEAR_REDIRECT_URL}&response_type=code&scope=${LINEAR_SCOPE}`

  return NextResponse.json({ authUrl })
}
