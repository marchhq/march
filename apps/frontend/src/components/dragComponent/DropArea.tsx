"use client"

import React, { useState } from "react"

const DropArea = () => {
  const [showDrop, setShowDrop] = useState(false)

  // Handle drag over to show drop area
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault() // Prevent default to allow drop
    setShowDrop(true)
  }

  // Handle drag leave to hide drop area
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setShowDrop(false)
  }

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setShowDrop(false)
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => {
        e.preventDefault() // Prevent default to allow drop
        setShowDrop(true)
      }}
      onDrop={handleDrop}
      className={`size-full transition-all duration-300 ${
        showDrop
          ? "border-2 border-dashed border-blue-500 bg-blue-100"
          : "bg-gray-100"
      } flex items-center justify-center`}
    >
      {showDrop ? (
        <div className="text-blue-500 text-xl font-semibold">Drop here</div>
      ) : (
        <div className="text-gray-500">Drag and drop content here</div>
      )}
    </div>
  )
}

export default DropArea
