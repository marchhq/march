import { NextResponse } from "next/server"
import axios from "axios"
import { getSession } from "@/actions/session"
import { BACKEND_URL, FRONTEND_URL } from "@/lib/constants"

export const dynamic = 'force-dynamic'
const redirectDomain = FRONTEND_URL

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    
    // Get redirect URL from query params if it exists
    const redirectUrl = searchParams.get('redirect') || '/'
    
    if (error) {
      return NextResponse.redirect(new URL(`/?error=${error}`, redirectDomain))
    }

    if (!code || !state) {
      console.error("Missing code or state parameters")
      return NextResponse.redirect(new URL(`/?error=missing_parameters`, redirectDomain))
    }

    // Get the session token for authorization
    const session = await getSession()
    if (!session) {
      console.error("No session found")
      return NextResponse.redirect(new URL(`/?error=unauthorized`, redirectDomain))
    }

    // Call the backend to get the access token
    await axios.get(`${BACKEND_URL}/x/getAccessToken`, {
      params: {
        code,
        state
      },
      headers: {
        'Authorization': `Bearer ${session}`,
      }
    })

    return NextResponse.redirect(new URL(redirectUrl, redirectDomain))
  } catch (error) {
    console.error("X OAuth error:", error)
    return NextResponse.redirect(new URL(`/?error=x_auth_failed`, redirectDomain))
  }
}
