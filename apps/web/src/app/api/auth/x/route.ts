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

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    if (!code) {
      return NextResponse.json({ error: "No code received" }, { status: 400 })
    }

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the access token from backend
    await axios.get(`${BACKEND_URL}/x/getAccessToken`, {
      params: { code },
      headers: {
        'Authorization': `Bearer ${session}`,
      }
    })

    // Get redirect URL from state if it exists
    let redirectUrl = '/'
    try {
      const stateData = JSON.parse(decodeURIComponent(state || ''))
      if (stateData.redirect) {
        redirectUrl = stateData.redirect
      }
    } catch (e) {
      // If state parsing fails, use default redirect
      console.error("X OAuth error:", e)
    }

    return NextResponse.redirect(new URL(redirectUrl, redirectDomain))

  } catch (error) {
    console.error("X OAuth error:", error)
    return NextResponse.redirect(new URL(`/?error=x_auth_failed`, redirectDomain))
  }
}
