"use client"

import React, { createContext, useState, useEffect, useContext } from "react"

import axios, { type AxiosError } from "axios"

import { BACKEND_URL } from "../lib/constants/urls"
import Loader from "../lib/icons/Loader"
import { getSession, clearSession } from "../lib/server/actions/sessions"

interface AuthContextType {
  session: string
  loading: boolean
  googleLogin: (code: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  const [session, setSession] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadSessionFromCookie(): Promise<void> {
      try {
        const session = await getSession()
        setSession(session)
      } catch (error) {
        console.error("Failed to load session", error)
      } finally {
        setLoading(false)
      }
    }
    void loadSessionFromCookie()
  }, [])

  /**
   * Logs in the user using Google OAuth.
   * @param code The code returned from Google OAuth.
   * @returns redirects to today page from server side
   */
  const googleLogin = async (code: string): Promise<void> => {
    try {
      console.log(code)

      const res = await axios.post(`${BACKEND_URL}/auth/google/login`, null, {
        headers: {
          "x-google-auth": `${code}`,
        },
      })

      console.log(res)
    } catch (error) {
      const e = error as AxiosError
      if (e.response?.status === 401) {
        console.error("Login error", e.response.data)
        // Handle login error (e.g., show error message to session)
      } else {
        console.error("Login error", error)
      }
      // Handle login error (e.g., show error message to session)
    }
  }

  /**
   * Logs out the user.
   * @returns redirects to login page from server side
   */
  const logout = async (): Promise<void> => {
    try {
      await clearSession()
    } catch (error) {
      console.error("Logout error", error)
      // toast.error("Logout error")
    }
  }

  const value = { session, loading, googleLogin, logout }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-[#313131]">
        <Loader />
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
