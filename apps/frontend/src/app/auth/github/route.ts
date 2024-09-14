import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/src/lib/constants/cookie";
import { BACKEND_URL } from "@/src/lib/constants/urls";

// Handle the GitHub callback and set cookies
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    console.error("No code received from GitHub");
    return NextResponse.redirect(new URL("/login?error=no_code", request.url));
  }

  try {
    const response = await axios.get(`${BACKEND_URL}/auth/github/login`, {
      params: { code },
    });

    const { accessToken, refreshToken, isNewUser } = response.data;

    const res = NextResponse.redirect(
      //redirecting to inbox for test
      isNewUser ? new URL("/app/inbox", request.url) : new URL("/app/today", request.url)
    );

    res.cookies.set(ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    res.cookies.set(REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Error during GitHub authentication:", error);
    return NextResponse.redirect(new URL("/login?error=authentication_failed", request.url));
  }
}
