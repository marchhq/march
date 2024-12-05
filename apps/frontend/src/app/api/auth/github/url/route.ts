import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
  const GITHUB_SCOPE = "user:email"

  if (!GITHUB_CLIENT_ID) {
    return NextResponse.json(
      {
        error: "github client_id is not set",
      },
      {
        status: 500,
      }
    )
  }

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=${GITHUB_SCOPE}`

  return NextResponse.json({ authUrl })
}
