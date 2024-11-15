// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"

// import { ACCESS_TOKEN } from "@/src/lib/constants/cookie"
// import { BACKEND_URL } from "@/src/lib/constants/urls"

// async function verifyToken(token: string): Promise<boolean> {
//   try {
//     const response = await fetch(`${BACKEND_URL}/auth/user-verification/`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     const data = await response.json()
//     return data.isValidUser
//   } catch (error) {
//     console.error("Token verification failed:", error)
//     return false
//   }
// }

// export async function middleware(request: NextRequest): Promise<NextResponse> {
//   const token = request.cookies.get(ACCESS_TOKEN)?.value
//   const path = request.nextUrl.pathname

//   // Public paths that don't require authentication, can be updated later
//   const publicPaths = ["/", "/login", "/register"]

//   if (publicPaths.includes(path)) {
//     // If the user has a token and trying to access a public route
//     if (token) {
//       const isValidToken = await verifyToken(token)
//       if (isValidToken && path === "/") {
//         return NextResponse.redirect(new URL("/today", request.url))
//       }
//     }
//     return NextResponse.next()
//   }

//   // For protected routes
//   if (!token) {
//     return NextResponse.redirect(new URL("/", request.url))
//   }

//   const isValidToken = await verifyToken(token)
//   if (!isValidToken) {
//     const response = NextResponse.redirect(new URL("/", request.url))
//     return response
//   }

//   // Token is valid, continue with the request
//   return NextResponse.next()
// }

// export const config = {
//   matcher: ["/((?!api|auth|_next/static|_next/image|favicon.ico).*)"],
// }

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { ACCESS_TOKEN } from "@/src/lib/constants/cookie"
import { BACKEND_URL } from "@/src/lib/constants/urls"

type Data = {
  isValidUser: boolean
  userVerification: boolean
  waitlist: boolean
}

async function verifyToken(token: string): Promise<Data | false> {
  if (!token) return false // Ensure the token is provided
  try {
    const response = await fetch(`${BACKEND_URL}/auth/user-verification/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      throw new Error("Failed to verify token")
    }
    const data: Data = await response.json()
    return data
  } catch (error) {
    console.error("Token verification failed:", error)
    return false
  }
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get(ACCESS_TOKEN)?.value
  const path = request.nextUrl.pathname
  const publicPath = ["/"]

  const result = await verifyToken(token || "")

  // If !result and trying to access protected routes
  if (!result && !publicPath.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If result, valid user  with a verified profile, trying to access a public path
  if (
    result &&
    result.isValidUser &&
    result.userVerification &&
    publicPath.includes(path)
  ) {
    return NextResponse.redirect(new URL("/today", request.url))
  }

  if (result && !result.isValidUser) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If user is not verified and on 'waitlist, no need to redirect anywhere
  if (
    result &&
    result.isValidUser &&
    !result.userVerification &&
    path.includes("waitlist")
  ) {
    return NextResponse.next()
  }

  if (
    result &&
    result.isValidUser &&
    result.userVerification &&
    path.includes("waitlist")
  ) {
    return NextResponse.redirect(new URL("/today", request.url))
  }

  // If valid user with no verification, send them to /waitlist
  if (result && result.isValidUser && !result.userVerification) {
    return NextResponse.redirect(new URL("/waitlist", request.url))
  }

  // For now, allow access to everything else
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|auth|_next/static|_next/image|favicon.ico).*)"],
}
