"use client"
import React, { useEffect, useState } from "react"
import { ThisWeekArrows } from "./ThisWeekArrows"
import { ThisWeekSection } from "./ThisWeekSection"
import { addWeeks } from "date-fns"
import {
  getCurrentWeek,
  getFormattedDateRange,
  getWeeksInMonth,
} from "@/src/utils/datetime"
import { useAuth } from "@/src/contexts/AuthContext"
import useItemsStore, { ItemStoreType } from "@/src/lib/store/items.store"
import { Item } from "@/src/lib/@types/Items/Items"
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd"

const initialItems = [
  { id: "1", content: "hello" },
  { id: "2", content: "hello 2" },
  { id: "3", content: "hello 3" },
]

export const ThisWeekPage: React.FC = () => {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(today)
  const weekNumber = getCurrentWeek(currentDate)
  const totalWeeks = getWeeksInMonth(currentDate)
  const formattedDateRange = getFormattedDateRange(currentDate)
  const { session } = useAuth()
  const { items, fetchItems, mutateItem } = useItemsStore()
  const [Items, setItems] = useState(initialItems)

  useEffect(() => {
    if (session) {
      fetchItems(session, "this-week")
    }
  }, [fetchItems, session])

  /* const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const newStatus = destination.droppableId

    if (session) {
      try {
        await mutateItem(session, draggableId, newStatus)
      } catch (error) {
        console.error("Error updating item status:", error)
      }
    }
  } */

  const todoItems = items.filter((item: Item) => item.status === "todo")
  const inProgressItems = items.filter(
    (item: Item) => item.status === "in progress"
  )
  const doneItems = items.filter((item: Item) => item.status === "done")

  const onDragEnd = (result: DropResult) => {
    // Check if the item was dropped outside the droppable area
    if (!result.destination) {
      return
    }

    const reorderedItems = Array.from(Items)
    const [movedItem] = reorderedItems.splice(result.source.index, 1)
    reorderedItems.splice(result.destination.index, 0, movedItem)

    setItems(reorderedItems)
  }

  const handleWeekChange = (direction: "left" | "right") => {
    setCurrentDate((prevDate) => {
      const newDate = addWeeks(prevDate, direction === "left" ? -1 : 1)
      const newWeekNumber = getCurrentWeek(newDate)
      return newWeekNumber >= 1 && newWeekNumber <= totalWeeks
        ? newDate
        : prevDate
    })
  }

  return (
    <div className="w-9/12 flex flex-col gap-8">
      <div className="flex items-center gap-8 text-sm">
        <h1 className="text-foreground text-2xl">Week {weekNumber}</h1>
        <div className="flex gap-4">
          <p>
            {doneItems.length}/{items.length} completed
          </p>
          <p>{((doneItems.length / items.length) * 100).toFixed(0)}%</p>
          <p>{formattedDateRange}</p>
        </div>
        <ThisWeekArrows onChangeWeek={handleWeekChange} />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable key={1} droppableId="1">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Draggable key={1} draggableId="1" index={1}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    hello
                  </div>
                )}
              </Draggable>

              <Draggable key={2} draggableId="2" index={2}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    hello 2
                  </div>
                )}
              </Draggable>

              <Draggable key={3} draggableId="3" index={3}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    hello 3
                  </div>
                )}
              </Draggable>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/*<DragDropContext onDragEnd={onDragEnd}>
        <div className="flex w-full max-w-screen-xl gap-8">
           <ThisWeekSection
            icon="material-symbols:circle-outline"
            title="To Do"
            items={todoItems}
            status="todo"
          />
          <ThisWeekSection
            icon="carbon:circle-dash"
            title="In Progress"
            items={inProgressItems}
            status="in progress"
          />
          <ThisWeekSection
            icon="material-symbols:circle"
            title="Done"
            items={doneItems}
            status="done"
          /> */}
    </div>
  )
}
