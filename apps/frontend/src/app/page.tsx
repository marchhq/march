import * as React from "react"

import { type Metadata } from "next"

import { GithubLogin } from "../components/atoms/GithubLogin"
import GoogleLogin from "../components/atoms/GoogleLogin"
import Line from "@/src/lib/icons/Line"
import Logo from "@/src/lib/icons/Logo"
import generateMetadata from "@/src/utils/seo"

export const metadata: Metadata = generateMetadata({
  path: "/",
  title: "march | satellite",
  description: "engineered for makers",
})

const Home: React.FC = () => {
  return (
    <main className="grid h-screen place-content-center text-center">
      <div className="flex h-screen flex-col items-center justify-between py-8">
        <div className="flex h-full flex-col items-center justify-center">
          <Logo size={64} />
          <h2 className="mt-12 text-3xl font-bold">Login to march</h2>

          <div className="mt-10 text-[17px] text-gray-color font-medium">
            <p>engineered for makers,</p>
            <div className="mt-2 flex min-w-full items-center gap-x-2">
              <p className="font-medium">designed</p> <Line />{" "}
              <p className="text-black font-medium">to get things done.</p>
            </div>
          </div>

          <div className="mt-10 text-sm space-y-2">
            <GoogleLogin />
            <GithubLogin />
          </div>
        </div>

        <div className="max-w-72 text-xs text-gray-color mt-6 mb-10">
          <p>By continuing, you agree to our </p>
          <p>
            <span className="text-black">terms of services</span> and our{" "}
            <span className="text-black">privacy policy.</span>
          </p>
        </div>
      </div>
    </main>
  )
}

export default Home
