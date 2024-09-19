"use client"
import { useEffect, useState } from "react"

import axios from "axios"
import Image from "next/image"

import { useAuth } from "@/src/contexts/AuthContext"
import { User } from "@/src/lib/@types/auth/user"
import { BACKEND_URL } from "@/src/lib/constants/urls"

export const ProfilePicture = (): JSX.Element => {
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
        return error
      }
    }

    fetchUser()
  }, [session])

  return (
    <Image
      src={user?.avatar as string}
      alt="Profile"
      width={68}
      height={66}
      className="border border-[#262626]/80"
    />
  )
}
