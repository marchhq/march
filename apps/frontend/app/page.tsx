import * as React from "react"

import { type Metadata } from "next"

import Google from "@/components/icons/Google"
import Line from "@/components/icons/Line"
import Logo from "@/components/icons/Logo"
import generateMetadata from "utils/seo"

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
          <Logo size={52} />
          <h2 className="mt-4 font-semibold">Welcome to march</h2>

          <div className="mt-6 text-gray-color">
            <p>engineered for makers,</p>
            <div className="mt-1 flex min-w-full items-center gap-x-2">
              <p>designed</p> <Line />{" "}
              <p className="text-black">to get things done.</p>
            </div>
          </div>

          <div className="mt-5 text-sm">
            <button className="flex w-80 items-center justify-center gap-x-6 rounded-2xl border border-button-stroke bg-transparent p-2 text-black">
              <Google />
              Continue with google
            </button>
          </div>
        </div>

        <div className="max-w-72 text-xs text-gray-color">
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
