"use client"
import { useEffect, useState } from "react"

import axios from "axios"

import { useAuth } from "@/src/contexts/AuthContext"
import { User } from "@/src/lib/@types/auth/user"
import { BACKEND_URL } from "@/src/lib/constants/urls"

export const useUserInfo = () => {
  const [user, setUser] = useState<User | null>(null)
  const { session } = useAuth()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>(`${BACKEND_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        })
        setUser(response.data)
      } catch (error) {
        console.error("Failed to fetch user info:", error)
      }
    }

    if (session) {
      fetchUser()
    }
  }, [session])

  return user
}
