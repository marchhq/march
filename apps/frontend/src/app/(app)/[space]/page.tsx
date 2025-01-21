"use client"
import React, { useState } from "react"

import useSpaceStore from "@/src/lib/store/space.store"

interface PageProps {
  params: { [key: string]: string }
}

const Page: React.FC<PageProps> = ({ params }) => {
  const { toggleRightSidePopUp } = useSpaceStore()
  const [userSpace, setUserSpace] = useState<any[] | null>(null)
  return (
    <div className="flex h-screen items-center justify-center bg-red-300">
      {!userSpace ? (
        <div className="h-auto w-36 bg-zinc-500">
          <h1 className="text-center"> {params.space} </h1>
          <p>You can add fully customize app by adding block</p>
          <button className="bg-blue-800 px-3 " onClick={toggleRightSidePopUp}>
            {" "}
            + Add block{" "}
          </button>
        </div>
      ) : (
        <div className="size-full"></div>
      )}
    </div>
  )
}

export default Page
