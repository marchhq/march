// src/components/dragComponent/DropArea.tsx
"use client"

import React, { useState } from "react"
import useArrayStore from "@/src/lib/store/array.store"

interface DropAreaProps {
  onDrop: (content:string) => void
  children?: React.ReactNode
  className?: string
  draggableValue:string |null
}

const DropArea: React.FC<DropAreaProps> = ({
  onDrop,
  children,
  draggableValue,
  className = "",
}) => {
  const { draggableArray, setDraggableArray } = useArrayStore()
  
  const [showDrop, setShowDrop] = useState(false)

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setShowDrop(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setShowDrop(false)
  }

  

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => {
        e.preventDefault()
        setShowDrop(true)
      }}
      onDrop={(e)=>{
        e.preventDefault();
        setShowDrop(false);
        onDrop('draggableArray')
      }}
      className={`
        ${className} 
        transition-all duration-300 
        ${showDrop ? "border-2 border-dashed border-blue-500 bg-blue-100" : "bg-gray-100"}
        flex items-center justify-center
      `}
    >
      {children ? (
        children
      ) : showDrop ? (
        <div className="text-blue-500 text-xl font-semibold">Drop here</div>
      ) : (
        <div className="text-gray-500">Drag and drop content here</div>
      )}
    </div>
  )
}

export default DropArea