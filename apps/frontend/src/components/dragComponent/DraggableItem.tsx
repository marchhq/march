// src/components/DraggableItem.tsx
"use client"

import React from 'react'
import useArrayStore from "@/src/lib/store/array.store"

interface DraggableItemProps {
  content: string
}

const DraggableItem: React.FC<DraggableItemProps> = ({ content }) => {
  const { setDraggableArray } = useArrayStore()

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Set the draggable array with the current item
    setDraggableArray([content])
    
    // Optional: set data transfer for cross-component compatibility
    e.dataTransfer?.setData('text/plain', content)
  }

  return (
    <div 
      draggable 
      onDragStart={handleDragStart}
      className="p-2 bg-blue-100 border border-blue-300 cursor-move"
    >
      {content}
    </div>
  )
}

export default DraggableItem