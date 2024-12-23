"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { ACCESS_TOKEN } from "@/src/lib/constants/cookie"

/**
 * Asynchronously retrieves the session token.
 * @returns A Promise that resolves to a string representing the session token.
 */
const getSession = async (): Promise<string | null> => {
  const token = (await cookies()).get(ACCESS_TOKEN)
  return token?.value || null // Return null if token or value is undefined
}

/**
 * Asynchronously sets the session token.
 * @param session The session token to set.
 * @returns A Promise that resolves to void.
 */
const setSession = async (session: string): Promise<void> => {
  ;(await cookies()).set(ACCESS_TOKEN, session, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })
  return redirect("/today")
}

/**
 * Asynchronously clears the session token.
 * @returns A Promise that resolves to void.
 */
const clearSession = async (): Promise<void> => {
  ;(await cookies()).delete(ACCESS_TOKEN)
  return redirect("/")
}

export { getSession, setSession, clearSession }
