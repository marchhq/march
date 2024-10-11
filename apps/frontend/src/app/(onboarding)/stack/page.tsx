import React from "react"

import { Icon } from "@iconify-icon/react"
import Link from "next/link"

import { Integrations } from "@/src/components/atoms/Integrations"

const StackConnect: React.FC = () => {
  return (
    <main className="flex h-full flex-col items-center justify-between">
      <div className="flex size-full flex-col items-center justify-center gap-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center p-2">
            <Icon icon="uil:circuit" className="text-[50px]" />
          </div>
          <h2 className="text-3xl font-bold">Connect Your Stack</h2>
        </div>
        <div className="flex flex-col gap-1 text-base font-medium text-secondary-foreground">
          <Integrations />
        </div>
        <div className="flex w-full flex-col items-center gap-2 text-base">
          <Link
            href={"/today"}
            className="hover-text flex gap-x-6 bg-transparent p-6 text-xl font-semibold"
          >
            continue
          </Link>
        </div>
      </div>
      <div className="w-full text-sm text-secondary-foreground">
        <div className="text-center">
          <Link href={"/inbox"}>
            <button className="hover-text">I&apos;ll do this later</button>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default StackConnect
