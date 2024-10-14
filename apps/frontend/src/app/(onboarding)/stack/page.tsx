"use client"
import React, { useState, useEffect } from "react"

import { Icon } from "@iconify-icon/react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Integrations } from "@/src/components/atoms/Integrations"
import Loader from "@/src/lib/icons/Loader"

const StackConnect: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    return () => {
      setIsLoading(false)
    }
  }, [])

  const handleContinue = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push("/today")
    }, 1500)
  }

  if (isLoading) {
    return (
      <div className="flex h-full  z-10 items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <main className="flex h-full flex-col items-center justify-between">
      <div className="flex size-full flex-col items-center justify-center gap-12 pb-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center p-2">
            <Icon icon="uil:circuit" className="text-[50px]" />
          </div>
          <h2 className="text-3xl font-bold">Connect Your Stack</h2>
        </div>
        <div className="flex flex-col gap-8 text-base font-medium text-secondary-foreground">
          <Integrations />
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
