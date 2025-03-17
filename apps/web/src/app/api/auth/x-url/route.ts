import { NextResponse } from "next/server"
import { TwitterApi } from "twitter-api-v2"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const X_CLIENT_ID = process.env.X_CLIENT_ID
    const X_CLIENT_SECRET = process.env.X_CLIENT_SECRET
    const X_REDIRECT_URL = process.env.X_REDIRECT_URL

    if (!X_CLIENT_ID || !X_CLIENT_SECRET || !X_REDIRECT_URL) {
      console.log("Missing env variables")
      return NextResponse.json(
        { error: "Required X OAuth credentials are not set" },
        { status: 500 }
      )
    }

    const twitterClient = new TwitterApi({
      clientId: X_CLIENT_ID,
      clientSecret: X_CLIENT_SECRET
    })

    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
      X_REDIRECT_URL,
      { scope: ["tweet.read", "users.read", "bookmark.read", "offline.access"] }
    )

    // Store state and verifier in cookies for validation in callback
    const response = NextResponse.json({ authUrl: url }, { status: 200 })
    
    response.cookies.set('x_oauth_state', state, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 5 * 60 // 5 minutes to match backend cleanup
    })
    
    response.cookies.set('x_code_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 5 * 60
    })

    return response
  } catch (error) {
    console.error("Error generating X auth URL:", error)
    return NextResponse.json(
      { error: "Failed to generate auth URL" },
      { status: 500 }
    )
  }
}