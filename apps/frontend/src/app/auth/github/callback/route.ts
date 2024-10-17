import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

import { LINEAR_ACCESS_TOKEN } from "@/src/lib/constants/cookie";
import { BACKEND_URL } from "@/src/lib/constants/urls";

export async function GET(request: NextRequest) {

  const searchParams = request.nextUrl.searchParams;
  const installation_id = searchParams.get("installation_id");
  const cookies = request.cookies;
  const session = cookies.get("__MARCH_ACCESS_TOKEN__");
  const token = session?.value;

  try {
   

    const response = await axios.get(`${BACKEND_URL}/github/callback`, {
      params: { installation_id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const { accessToken } = response.data;

      const res = NextResponse.redirect(new URL("/profile", request.url));
      res.cookies.set(LINEAR_ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
      return res;
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
