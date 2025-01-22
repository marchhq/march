"use client"
import React, { useEffect, useState } from "react"

import useSpaceStore from "@/src/lib/store/array.store"

const RightSidePopup = () => {
  const { rightSideArrayList, toggleRightSidePopUp, setDraggableSpace } =
    useSpaceStore()
  const [popUp, setPopUp] = useState<boolean>(false)

  useEffect(() => {
    setPopUp(rightSideArrayList)
  }, [rightSideArrayList])

  return (
    <div
      className={` ${popUp ? "fixed end-0 top-0" : "hidden"}  flex h-screen w-96 flex-col bg-gray-800 text-white shadow-xl`}
    >
      <div className="border-b border-gray-700 p-6">
        <h2 className="text-center text-xl font-bold">Quick Access</h2>
      </div>
      <ul className="grow space-y-4 p-4">
        <li className="rounded-lg p-3 transition hover:bg-gray-700">
          <button className="w-full text-left">📓 Notes</button>
        </li>
        <li className="rounded-lg p-3 transition hover:bg-gray-700">
          <button
            className="w-full text-left"
            value="Calendar"
            draggable
            onDragStart={() => setDraggableSpace("calender")}
          >
            📅 Calendar
          </button>
        </li>
        <li className="rounded-lg p-3 transition hover:bg-gray-700">
          <button className="w-full text-left">📔 Journal</button>
        </li>
        <li className="rounded-lg p-3 transition hover:bg-gray-700">
          <button className="w-full text-left">✅ List</button>
        </li>
        <li className="rounded-lg p-3 transition hover:bg-gray-700">
          <button className="w-full text-left">📌 Board</button>
        </li>
      </ul>
      <div className="border-t border-gray-700 p-6 text-center">
        <button
          className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          onClick={toggleRightSidePopUp}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default RightSidePopup
