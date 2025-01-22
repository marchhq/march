// "use client"
// import React, { useEffect, useState } from "react"

// import DayCalendar from "./Calender"
// import DropArea from "@/src/components/dragComponent/DropArea"
// import type { Block } from "@/src/lib/@types/Items/Block"
// import useSpaceStore from "@/src/lib/store/array.store"
// import useBlockStore from "@/src/lib/store/block.store"

// interface PageProps {
//   arrayId: string
//   token: string
// }
// const INITIAL_EVENTS = [
//   {
//     id: "1",
//     title: "All-day event",
//     start: new Date(),
//   },
//   {
//     id: "2",
//     title: "Timed event",
//     start: new Date(),
//   },
// ]
// const Block: React.FC<PageProps> = ({ arrayId, token }) => {
//   const [RightPopUp, setRightPopUp] = useState<boolean>(false)
//   const [block, setBlock] = useState<Block[]>([])
//   const { fetchBlocks, blocks } = useBlockStore()

//   useEffect(() => {
//     fetchBlocks(token, arrayId)
//   }, [token])
//   useEffect(() => {
//     setBlock(blocks)
//   }, [blocks])
//   return (
//     <div className="flex h-screen items-center justify-center ">
//       <DayCalendar currentDate={new Date()} initialEvents={INITIAL_EVENTS} />
//       {/* {!RightPopUp ? (
//         <div className="h-auto w-36 bg-zinc-500">
//           <h1 className="text-center">
//             {" "}
//             {arrays.find((a) => a._id === params.space)?.name}{" "}
//           </h1>
//           <p>You can add fully customize app by adding block</p>
//           <button className="bg-blue-800 px-3 " onClick={toggleRightSidePopUp}>
//             {" "}
//             + Add block{" "}
//           </button>
//         </div>
//       ) : (
//         <div className="grid size-full  h-screen grid-cols-2 bg-red-300 ">
//           <div className="">
//             {" "}
//             <DropArea />{" "}
//           </div>
//           <div className="">
//             <DropArea />
//           </div>
//         </div>
//       )} */}
//     </div>
//   )
// }

// export default Block

"use client"
import React, { useEffect, useState } from "react"

import DayCalendar from "./Calender"
import DropArea from "@/src/components/dragComponent/DropArea"
import useBlockStore from "@/src/lib/store/block.store"

interface PageProps {
  arrayId: string
  token: string
}

const INITIAL_EVENTS = [
  {
    id: "1",
    title: "All-day event",
    start: "2025-01-22T00:00:00", // ISO format
  },
  {
    id: "2",
    title: "Timed event",
    start: "2025-01-22T10:00:00", // ISO format
  },
]

const Block: React.FC<PageProps> = ({ arrayId, token }) => {
  const [block, setBlock] = useState([])
  const { fetchBlocks, blocks } = useBlockStore()

  useEffect(() => {
    fetchBlocks(token, arrayId)
  }, [fetchBlocks, token, arrayId])

  useEffect(() => {
    return setBlock(block)
  }, [block])

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <DayCalendar
          currentDate={new Date("2025-01-22")}
          initialEvents={INITIAL_EVENTS}
        />
      </div>
    </div>
  )
}

export default Block
