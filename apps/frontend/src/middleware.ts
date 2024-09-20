import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { getSession } from "./lib/server/actions/sessions"

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const session = await getSession()

  // Get the pathname of the request (e.g. /, /protected, /api/user)
  const path = request.nextUrl.pathname

  // If the user is not authenticated and trying to access any route other than '/'
  if (session.length === 0 && path !== "/") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If the user is authenticated and trying to access the '/' route
  if (session.length !== 0 && path === "/") {
    return NextResponse.redirect(new URL("/app/today", request.url))
  }

  // For all other cases, continue with the request
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|auth|_next/static|_next/image|favicon.ico).*)"],
}
