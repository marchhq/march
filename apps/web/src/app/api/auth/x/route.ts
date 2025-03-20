import { NextResponse } from "next/server";
import axios from "axios";
import { getSession } from "@/actions/session";
import { BACKEND_URL, FRONTEND_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";
const redirectDomain = FRONTEND_URL;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    if (!code) {
      return NextResponse.json({ error: "No code received" }, { status: 400 });
    }

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse state to get both redirect URL and codeVerifier
    let redirectUrl = "/";
    let codeVerifier = "";
    try {
      const stateData = JSON.parse(decodeURIComponent(state || ""));
      
      if (stateData.redirect) {
        redirectUrl = stateData.redirect;
      }
      if (stateData.codeVerifier) {
        codeVerifier = stateData.codeVerifier;
      }
    } catch (e) {
      console.error("Error parsing state:", e);
      return NextResponse.redirect(
        new URL(`/?error=invalid_state`, redirectDomain)
      );
    }

    if (!codeVerifier) {
      return NextResponse.redirect(
        new URL(`/?error=missing_code_verifier`, redirectDomain)
      );
    }

    // Get the access token from backend
    await axios.get(`${BACKEND_URL}/x/getAccessToken`, {
      params: { 
        code,
        codeVerifier
      },
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    return NextResponse.redirect(new URL(redirectUrl, redirectDomain));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("X OAuth error:", {
        response: error.response?.data,
        status: error.response?.status
      });
    }
    return NextResponse.redirect(
      new URL(`/?error=x_auth_failed`, redirectDomain)
    );
  }
}
