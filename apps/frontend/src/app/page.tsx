import React from "react"

import { type Metadata } from "next"

import Link from "next/link"

import { GithubLogin } from "../components/login/GithubLogin"
import GoogleLogin from "../components/login/GoogleLogin"
import Line from "@/src/lib/icons/Line"
import { LogoDark } from "@/src/lib/icons/Logo"
import generateMetadata from "@/src/utils/seo"

export const metadata: Metadata = generateMetadata({
  path: "/",
  title: "march",
  description: "engineered for makers",
})

const Home: React.FC = () => {
  return (
    <section className="h-screen">
      <div className="p-8">
        <LogoDark />
      </div>
      <main className="grid h-[calc(100vh-350px)] place-items-center bg-background text-center text-muted">
        <div className="flex w-full max-w-7xl flex-col items-center justify-between">
          <div className="flex flex-col items-center justify-center gap-12">
            <div className="flex flex-col text-left font-medium text-secondary-foreground">
              <h1>for makers</h1>
              <h1 className="text-primary-foreground">to get things done.</h1>
            </div>
            <div className="flex w-full flex-col items-center gap-4 text-base">
              <GoogleLogin />
              <GithubLogin />
            </div>
          </div>
        </div>
      </main>
      <div className="absolute inset-x-0 bottom-8">
        <div className="mx-auto w-full max-w-lg text-xs text-gray-color">
          <div className="text-center">
            <p>By continuing, you agree to our </p>
            <p>
              <span className="text-gray-100">
                <Link
                  target="_blank"
                  href="https://marchhq.notion.site/Terms-Privacy-67fb3e8525c04fcfa73dca152ecc1dec"
                >
                  terms of services
                </Link>
              </span>{" "}
              and our{" "}
              <span className="text-gray-100">
                <Link
                  target="_blank"
                  href="https://marchhq.notion.site/Terms-Privacy-67fb3e8525c04fcfa73dca152ecc1dec"
                >
                  privacy policy.
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
