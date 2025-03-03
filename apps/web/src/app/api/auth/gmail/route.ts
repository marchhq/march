import { getSession } from "@/actions/session";
import { BACKEND_URL, FRONTEND_URL } from "@/lib/constants";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Default redirect
  let redirectUrl = '/agenda';

  // Try to get redirect URL from state
  if (state) {
    try {
      const stateData = JSON.parse(decodeURIComponent(state));
      if (stateData.redirect) {
        redirectUrl = stateData.redirect;
      }
    } catch (e) {
      console.error('Failed to parse state:', e);
    }
  }

  // Handle Google OAuth errors
  if (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(
      new URL(`${redirectUrl}?error=${error}`, FRONTEND_URL)
    );
  }

  if (!code) {
    console.error("No code received from Gmail");
    return NextResponse.redirect(
      new URL(`${redirectUrl}?error=no_code`, FRONTEND_URL)
    );
  }

  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(
      new URL(`${redirectUrl}?error=no_session`, FRONTEND_URL)
    );
  }

  try {
    const response = await axios.post(
      `${BACKEND_URL}/gmail/callback`,
      { code },
      {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      }
    );

    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Failed to connect Gmail');
    }

    return NextResponse.redirect(new URL(redirectUrl, FRONTEND_URL));
  } catch (error) {
    console.error("Error connecting Gmail:", error);
    return NextResponse.redirect(
      new URL(`${redirectUrl}?error=gmail_connection_failed`, FRONTEND_URL)
    );
  }
}