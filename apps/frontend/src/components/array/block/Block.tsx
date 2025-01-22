"use client"
import React, { useEffect, useState } from "react"

import DayCalendar from "./Calender"
import DropArea from "@/src/components/dragComponent/DropArea"
import type { Block } from "@/src/lib/@types/Items/Block"
import useSpaceStore from "@/src/lib/store/array.store"
import useBlockStore from "@/src/lib/store/block.store"
import useArrayStore from "@/src/lib/store/array.store"

interface PageProps {
  arrayId: string
  token: string
}
const INITIAL_EVENTS = [
  {
    id: "1",
    title: "All-day event",
    start: new Date(),
  },
  {
    id: "2",
    title: "Timed event",
    start: new Date(),
  },
]
const Block: React.FC<PageProps> = ({ arrayId, token }) => {
  const { toggleRightSidePopUp , rightSideArrayList ,draggableArray, setDraggableArray} = useArrayStore()
  const [RightPopUp, setRightPopUp] = useState<boolean>(false)
  const [block, setBlock] = useState<Block[]>([])
  const { fetchBlocks, blocks } = useBlockStore()

  useEffect(() => {
    fetchBlocks(token, arrayId)
  }, [token])
  useEffect(() => {
    setBlock(blocks)
  }, [blocks])

  const [droppedContent, setDroppedContent] = useState<React.ReactNode[]>([])

  const handleDrop = (content: string) => {
    
    if (content!=='') {
      
      alert(`Dropped content: ${content}`)
      
      // Optionally, add the content to droppedContent state
      
    }
  }

  const handleMoveContent = (fromIndex: number, toIndex: number) => {
    const newContent = [...droppedContent]
    const [movedItem] = newContent.splice(fromIndex, 1)
    newContent.splice(toIndex, 0, movedItem)
    setDroppedContent(newContent)
  }

  return (
    <div className="flex h-screen items-center justify-center">
      {!rightSideArrayList && blocks.length === 0 ? (
        <div className="h-auto w-36 bg-zinc-500">
          <p>You can add fully customize app by adding block</p>
          <button className="bg-blue-800 px-3" onClick={toggleRightSidePopUp}>
            + Add block
          </button>
        </div>
      ) : (
        <div
          className={`
          ${droppedContent.length === 0 ? "w-full" : "grid grid-cols-2"} 
          h-screen bg-gray-100
        `}
        >
          {droppedContent.length === 0 ? (
            <DropArea 
              onDrop={handleDrop} 
              className="w-full h-full" 
              draggableValue={draggableArray}
            />
          ) : (
            <>
              {droppedContent.map((content, index) => (
                <div key={index} className="relative">
                  <DropArea 
                    onDrop={handleDrop} 
                    className="w-full h-full"
                    draggableValue={draggableArray}
                  >
                    {content}
                  </DropArea>
                </div>
              ))}
              {droppedContent.length < 2 && (
                <DropArea 
                  onDrop={handleDrop} 
                  className="w-full h-full"
                  draggableValue={draggableArray}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Block
