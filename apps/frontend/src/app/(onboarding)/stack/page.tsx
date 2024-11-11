"use client"
import React, { useState, useEffect } from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { Stack } from "@/src/components/onboarding/stack"
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
  if (!user && !isLoading) {
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
        <div className="font-medium">
          <h1>Connect your stack</h1>
          <h1 className="text-start">
            to <span className="text-primary-foreground">stay in flow</span>
          </h1>
        </div>
        <div className="flex flex-col gap-2 text-base font-medium text-secondary-foreground">
          {user && <Stack user={user} />}
        </div>
      </div>
      <div className="w-full text-sm text-secondary-foreground">
        <div className="flex w-full flex-col items-center gap-12 text-base">
          <button
            onClick={handleContinue}
            className="hover-text flex font-semibold"
          >
            <h1>Continue</h1>
          </button>
          <div className="text-center">
            <Link href="/inbox">
              <button className="hover-text">I&apos;ll do this later</button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default StackConnect
