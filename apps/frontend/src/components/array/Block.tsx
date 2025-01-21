"use client"
import React, { useEffect, useState } from "react"

import useSpaceStore from "@/src/lib/store/array.store"
import DropArea from "@/src/components/dragComponent/DropArea"
import useBlockStore from "@/src/lib/store/block.store"
import type { Block } from "@/src/lib/@types/Items/Block"

interface PageProps {
  arrayId: string
  token: string
}

const Block: React.FC<PageProps> = ({ arrayId, token }) => {
  const [RightPopUp, setRightPopUp] = useState<boolean>(false)
    const [block, setBlock] = useState<Block[]>([])
  const {fetchBlocks,blocks}=useBlockStore()

  useEffect(() => {
    fetchBlocks(token,arrayId)
  }, [token])
  useEffect(()=>{
    setBlock(blocks)
  },[blocks])
  return (
    <div className="flex h-screen items-center justify-center ">
        {block[0]?.name}
      {/* {!RightPopUp ? (
        <div className="h-auto w-36 bg-zinc-500">
          <h1 className="text-center">
            {" "}
            {arrays.find((a) => a._id === params.space)?.name}{" "}
          </h1>
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
      )} */}
    </div>
  )
}

export default Block
