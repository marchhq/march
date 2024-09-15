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
    <main className="grid h-screen w-full place-content-center text-center">
      <div className="flex h-screen w-full max-w-7xl flex-col items-center justify-between py-8">
        <div className="flex size-full flex-col items-center justify-center">
          <Logo size={64} />
          <h2 className="mt-10 text-3xl font-bold">Login to March</h2>

          <div className="mt-10 text-gray-color">
            <p>engineered for makers,</p>
            <div className="mt-2 flex w-full items-center justify-center gap-x-2">
              <p>designed</p> <Line />{" "}
              <p className="font-medium text-black">to get things done.</p>
            </div>
          </div>

          <div className="mt-10 w-full space-y-2 text-sm">
            <GoogleLogin />
            <GithubLogin />
          </div>
        </div>

        <div className="w-full max-w-lg text-xs text-gray-color">
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
