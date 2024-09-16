import React from "react"

import Link from "next/link"

import { Integrations } from "@/src/components/atoms/Integrations"

const StackConnect: React.FC = () => {
  return (
    <div className="flex min-h-full flex-col items-center justify-center p-4 text-center text-gray-color">
      <div className="mt-24 flex flex-col items-center">
        <h1 className="text-2xl font-semibold">Connect Your Stack</h1>
      </div>
      <div className="my-16 mt-12">
        <Integrations />
      </div>
      <div className="space-y-16">
        <Link href={"/timezone"}>
          <button className="flex w-60 items-center justify-center gap-x-6 rounded-2xl border border-button-stroke bg-transparent p-6 font-semibold text-black">
            Continue
          </button>
        </Link>
        <button className="hover:text-gray-900">suggest integration?</button>
      </div>
    </div>
  )
}

export default StackConnect
