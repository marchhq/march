import * as React from "react"

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
      <div className="flex h-screen w-full max-w-7xl flex-col items-center justify-between py-8">
        <div className="flex size-full flex-col items-center justify-center">
          <LogoDark />
          <h2 className="mt-10 text-3xl font-bold">Login to March</h2>

          <div className="mt-10 text-muted">
            <p>
              engineered for <span className="text-gray-100">makers,</span>
            </p>
            <div className="mt-2 flex w-full items-center justify-center gap-x-2">
              <p>designed</p> <Line />{" "}
              <p className="font-medium text-gray-100">to get things done.</p>
            </div>
          </div>

          <div className="mt-10 w-full space-y-2 text-sm">
            <GoogleLogin />
            <GithubLogin />
          </div>
        </div>
        <div className="w-full max-w-lg text-xs text-gray-color">
          <div className="mb-10 mt-6 text-center">
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
