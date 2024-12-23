import React from "react"

import classNames from "@/src/utils/classNames"

interface ViewWrapperProps {
  children: React.ReactNode
}

export const ViewWrapper = ({ children }: ViewWrapperProps) => {
  return (
    <main className="flex h-screen flex-1 gap-8 overflow-y-auto">
      <div
        className={classNames(
          "flex size-full max-w-[800px] flex-col gap-5 text-sm"
        )}
      >
        <section className="flex flex-col gap-5">{children}</section>
      </div>
    </main>
  )
}
