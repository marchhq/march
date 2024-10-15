"use client"

import React, { createContext, useState, useEffect, useContext } from "react"

import axios, { type AxiosError } from "axios"

import { BACKEND_URL } from "../lib/constants/urls"
import { getSession, clearSession } from "../lib/server/actions/sessions"

interface AuthContextType {
  session: string
  googleLogin: (code: string) => Promise<void>
  githubLogin: (code: string) => Promise<void> // Added GitHub login function
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  const [session, setSession] = useState<string>("")

  useEffect(() => {
    async function loadSessionFromCookie(): Promise<void> {
      try {
        const session = await getSession()
        setSession(session)
      } catch (error) {
        console.error("Failed to load session", error)
      }
    }
    void loadSessionFromCookie()
  }, [])

  /**
   * Logs in the user using Google OAuth.
   * @param code The code returned from Google OAuth.
   */
  const googleLogin = async (code: string): Promise<void> => {
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/google/login`, null, {
        headers: {
          "x-google-auth": `${code}`,
        },
      })

      console.log(res)
      // Handle successful login, e.g., setting session
    } catch (error) {
      const e = error as AxiosError
      if (e.response?.status === 401) {
        console.error("Login error", e.response.data)
        // Handle login error (e.g., show error message to user)
      } else {
        console.error("Login error", error)
      }
    }
  }

  /**
   * Logs in the user using GitHub OAuth.
   * @param code The code returned from GitHub OAuth.
   */
  const githubLogin = async (code: string): Promise<void> => {
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/github/login`, null, {
        headers: {
          "x-github-auth": `${code}`,
        },
      })

      console.log(res)
    } catch (error) {
      const e = error as AxiosError
      if (e.response?.status === 401) {
        console.error("GitHub login error", e.response.data)
      } else {
        console.error("GitHub login error", error)
      }
    }
  }

  /**
   * Logs out the user.
   */
  const logout = async (): Promise<void> => {
    try {
      await clearSession()
      // Handle successful logout
    } catch (error) {
      console.error("Logout error", error)
      // toast.error("Logout error")
    }
  }

  const value = { session, googleLogin, githubLogin, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
