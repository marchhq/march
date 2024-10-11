import React from "react"

import { type Metadata } from "next"

import Link from "next/link"

import { GithubLogin } from "../components/atoms/GithubLogin"
import GoogleLogin from "../components/atoms/GoogleLogin"
import Line from "@/src/lib/icons/Line"
import { LogoDark } from "@/src/lib/icons/Logo"
import generateMetadata from "@/src/utils/seo"

export const metadata: Metadata = generateMetadata({
  path: "/",
  title: "march | satellite",
  description: "engineered for makers",
})

const Home: React.FC = () => {
  return (
    <main className="grid h-screen w-full place-content-center bg-background text-center text-muted">
      <div className="flex flex-col items-center justify-between h-screen w-full max-w-7xl pb-16 pt-2">
        <div className="flex flex-col items-center justify-center gap-12 size-full">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center justify-center p-2">
              <LogoDark />
            </div>
            <h2 className="text-3xl font-bold">Login to March</h2>
          </div>
          <div className="flex flex-col gap-1 text-base text-secondary-foreground font-medium">
            <p>
              engineered for <span className="text-foreground">makers,</span>
            </p>
            <div className="flex w-full items-center justify-center gap-x-2">
              <p>designed</p> <Line />{" "}
              <p className="text-foreground">to get things done.</p>
            </div>
          </div>
          <div className="flex flex-col items-center w-full gap-4 text-base">
            <GoogleLogin />
            <GithubLogin />
          </div>
        </div>
        <div className="w-full max-w-lg text-xs text-gray-color">
          <div className="text-center">
            <p>By continuing, you agree to our </p>
            <p>
              <span className="text-gray-100">
                <Link
                  target="_blank"
                  href={
                    "https://marchhq.notion.site/Terms-Privacy-67fb3e8525c04fcfa73dca152ecc1dec"
                  }
                >
                  terms of services
                </Link>
              </span>{" "}
              and our{" "}
              <span className="text-gray-100">
                <Link
                  target="_blank"
                  href={
                    "https://marchhq.notion.site/Terms-Privacy-67fb3e8525c04fcfa73dca152ecc1dec"
                  }
                >
                  privacy policy.
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home
