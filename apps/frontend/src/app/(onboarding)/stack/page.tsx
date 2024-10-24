"use client"
import React, { useState, useEffect } from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"

import Integrations from "@/src/components/profile/Integrations"
import { useAuth } from "@/src/contexts/AuthContext"
import Loader from "@/src/lib/icons/Loader"
import useUserStore from "@/src/lib/store/user.store"

const StackConnect: React.FC = () => {
  const [isPageLoading, setIsLoading] = useState(false)
  const { session } = useAuth()
  const { user, error, isLoading, fetchUser } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    return () => {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session) {
      fetchUser(session)
    }
  }, [session, fetchUser])

  if (error) {
    return (
      <div className="text-red-500">Failed to fetch user data: {error}</div>
    )
  }
  if (!user) {
    return <div className="text-primary-foreground">User not found</div>
  }

  const handleContinue = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push("/today")
    }, 1500)
  }

  if (isPageLoading || isLoading) {
    return (
      <div className="z-10 flex  h-full items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <main className="flex h-full flex-col items-center">
      <div className="flex size-full flex-col items-center justify-center gap-12 pb-4">
        <div className="flex flex-col gap-2 text-base font-medium text-secondary-foreground">
          <Integrations user={user} />
          <div className="flex w-full flex-col items-center text-base">
            <button
              onClick={handleContinue}
              className="hover-text flex gap-x-6 bg-transparent text-xl font-semibold"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
      <div className="w-full text-sm text-secondary-foreground">
        <div className="text-center">
          <Link href="/inbox">
            <button className="hover-text">I&apos;ll do this later</button>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default StackConnect
