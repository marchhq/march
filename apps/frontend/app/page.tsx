import * as React from "react"

import { type Metadata } from "next"

import Link from "next/link"

import Button from "@/components/atoms/Button"
import generateMetadata from "utils/seo"

export const metadata: Metadata = generateMetadata({
  path: "/",
  title: "Satellite",
  description: "Satellite Frontend",
})

const Home: React.FC = () => {
  return (
    <main className="grid min-h-screen place-content-center">
      <div className="flex flex-col items-center">
        <h1 className="mb-16 animate-slideUpAndFade text-7xl font-semibold text-zinc-300">
          Welcome to Satellite!
        </h1>
        <Link href={"/app/auth/"} className="animate-slideDownAndFade">
          <Button
            className="flex items-center justify-center gap-1.5"
            variant={"primary"}
            size={"md"}
          >
            Get Started
          </Button>
        </Link>
      </div>
    </main>
  )
}

export default Home
