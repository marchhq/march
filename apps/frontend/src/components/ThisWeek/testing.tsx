"use client"

import React, { useState } from "react"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd"

interface Item {
  id: string
  content: string
}

const DraggableList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    // Your initial items here
    { id: "item1", content: "Item 1" },
    { id: "item2", content: "Item 2" },
    { id: "item3", content: "Item 3" },
  ])

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result

    // If the item is dropped outside the list
    if (!destination) {
      return
    }

    // If the item is dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // Creating a copy of the current items
    const newItems = Array.from(items)
    // Removing the dragged item from its original position
    const [reorderedItem] = newItems.splice(source.index, 1)
    // Inserting the dragged item at its new position
    newItems.splice(destination.index, 0, reorderedItem)

    // Updating the state with the new order
    setItems(newItems)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="1">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      padding: "8px",
                      margin: "4px",
                      backgroundColor: "lightgray",
                      borderRadius: "4px",
                    }}
                  >
                    {item.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default DraggableList
