import { GOOGLECALENDAR_ACCESS_TOKEN, GOOGLECALENDAR_REFRESH_TOKEN } from "@/src/lib/constants/cookie";
import { BACKEND_URL } from "@/src/lib/constants/urls";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("Google Calendar callback function called");
  console.log("Full request URL:", request.url);

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  console.log("Google Calendar code: ", code);

  if (!code) {
    return console.error("No code received from Google Calendar");
  }

  const cookies = request.cookies;
  const session = cookies.get("__MARCH_ACCESS_TOKEN__")
  console.log("session token: ", session)
  const token = session?.value

  try {
    console.log("Attempting to get access token from backend");
    const response = await axios.get(`${BACKEND_URL}/calendar/getAccessToken`, {
      params: { code },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Backend response received");

    const { accessToken, refreshToken } = response.data.tokenInfo;

    const res = NextResponse.redirect(new URL('/profile', request.url));
    res.cookies.set(GOOGLECALENDAR_ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    res.cookies.set(GOOGLECALENDAR_REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    console.log("Cookies set, redirecting to /profile");
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
    }
    return console.error("Error in Google Calendar callback:", error);
  }
}
