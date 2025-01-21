"use client"
import React, { useEffect, useState } from "react"

import useSpaceStore from "@/src/lib/store/space.store"
import DropArea from "@/src/components/dragComponent/DropArea"

interface PageProps {
  params: { [key: string]: string }
}

const Page: React.FC<PageProps> = ({ params }) => {
  const { rightSideSpaceList, toggleRightSidePopUp, draggableSpace } =
    useSpaceStore()
  const [RightPopUp, setRightPopUp] = useState<boolean>(false)

  useEffect(() => {
    setRightPopUp(rightSideSpaceList)
  }, [rightSideSpaceList])
  return (
    <div className="flex h-screen items-center justify-center ">
      {!RightPopUp ? (
        <div className="h-auto w-36 bg-zinc-500">
          <h1 className="text-center"> {params.space} </h1>
          <p>You can add fully customize app by adding block</p>
          <button className="bg-blue-800 px-3 " onClick={toggleRightSidePopUp}>
            {" "}
            + Add block{" "}
          </button>
        </div>
      ) : (
        <div className="grid size-full  h-screen grid-cols-2 bg-red-300 ">
          <div className="">
            {" "}
            <DropArea />{" "}
          </div>
          <div className="">
            <DropArea />
          </div>
        </div>
      )}
    </div>
  )
}

export default Page
