import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_TOKEN,
  BACKEND_URL,
  PUBLIC_PATHS,
  REDIRECT_PATHS,
} from "./lib/constants";
import { TokenVerificationResponse } from "./types/auth";

const PUBLIC_PATH_ARRAY = [PUBLIC_PATHS.HOME, PUBLIC_PATHS.SIGNIN] as const;

// Token verification
async function verifyToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/user-verification/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as TokenVerificationResponse;
    return data.isValidUser;
  } catch (error) {
    console.error(
      "Token verification failed:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return false;
  }
}

// Route protection helpers
function isPublicPath(path: string): boolean {
  return PUBLIC_PATH_ARRAY.includes(path as (typeof PUBLIC_PATH_ARRAY)[number]);
}

function createRedirectResponse(
  request: NextRequest,
  redirectPath: string
): NextResponse {
  return NextResponse.redirect(new URL(redirectPath, request.url));
}

// Middleware handler
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get(ACCESS_TOKEN)?.value;
  const path = request.nextUrl.pathname;

  // Handle public paths
  if (isPublicPath(path)) {
    if (token) {
      const isValidToken = await verifyToken(token);

      if (isValidToken && path === PUBLIC_PATHS.HOME) {
        return createRedirectResponse(
          request,
          REDIRECT_PATHS.AUTHENTICATED_HOME
        );
      }
    }
    return NextResponse.next();
  }

  // Handle protected paths
  if (!token) {
    return createRedirectResponse(request, REDIRECT_PATHS.UNAUTHENTICATED_HOME);
  }

  const isValidToken = await verifyToken(token);
  if (!isValidToken) {
    return createRedirectResponse(request, REDIRECT_PATHS.UNAUTHENTICATED_HOME);
  }

  return NextResponse.next();
}

// Matcher configuration
export const config = {
  matcher: [
    // Match all paths except static files, API routes, and auth routes
    "/((?!api|auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
