import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const scope = "tweet.read users.read bookmark.read offline.access"
    const X_CLIENT_ID = process.env.X_CLIENT_ID
    const X_REDIRECT_URL = process.env.X_REDIRECT_URL
    const X_SCOPE = encodeURIComponent(scope)

    if (!X_CLIENT_ID || !X_REDIRECT_URL) {
      console.log("Missing env variables")
      return NextResponse.json(
        {
          error: "x client_id or redirect_url is not set",
        },
        {
          status: 500,
        }
      )
    }

    const authUrl = `https://x.com/i/oauth2/authorize?response_type=code&client_id=${X_CLIENT_ID}&redirect_uri=${X_REDIRECT_URL}&scope=${X_SCOPE}`
    
    console.log("Generated X auth URL:", authUrl)
    return NextResponse.json({ authUrl }, { status: 200 })
  } catch (error) {
    console.error("Error generating X auth URL:", error)
    return NextResponse.json(
      { error: "Failed to generate auth URL" },
      { status: 500 }
    )
  }
} 