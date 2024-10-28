import React, { useCallback, useEffect, useRef, useState } from "react"

import { Icon } from "@iconify-icon/react"
import { motion } from "framer-motion"

import { useAuth } from "@/src/contexts/AuthContext"
import { CycleItem } from "@/src/lib/@types/Items/Cycle"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import classNames from "@/src/utils/classNames"
import { getEndOfCurrentWeek } from "@/src/utils/datetime"

export const CustomKanban = () => {
  return (
    <div className="h-full w-[calc(100%-100px)]">
      <Board />
    </div>
  )
}

const Board = () => {
  const { thisWeek, fetchThisWeek, updateItem } = useCycleItemStore()
  const { items } = thisWeek

  const { session } = useAuth()

  useEffect(() => {
    fetchThisWeek(session)
  }, [session, fetchThisWeek])

  const handleDragEnd = (itemId: string, newStatus: Partial<CycleItem>) => {
    updateItem(session, newStatus, itemId)
  }

  return (
    <div className="flex size-full gap-8">
      <Column
        title="todo"
        column="todo"
        items={items.filter((item) => item.status === "todo")}
        onDragEnd={handleDragEnd}
        icon="carbon:circle-outline"
      />
      <Column
        title="in progress"
        column="in progress"
        items={items.filter((item) => item.status === "in progress")}
        onDragEnd={handleDragEnd}
        icon="carbon:in-progress"
      />
      <Column
        title="done"
        column="done"
        items={items.filter((item) => item.status === "done")}
        onDragEnd={handleDragEnd}
        icon="carbon:circle-solid"
      />
    </div>
  )
}

const Column = ({ title, items, column, onDragEnd, icon }) => {
  const { createItem } = useCycleItemStore()
  const [active, setActive] = useState(false)

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("itemId", item._id)
    e.dataTransfer.setData("currentStatus", item.status)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    highlightIndicator(e)
    setActive(true)
  }

  const handleDragEnd = (e) => {
    e.preventDefault()
    const itemId = e.dataTransfer.getData("itemId")
    const currentStatus = e.dataTransfer.getData("currentStatus")

    setActive(false)
    clearHighlights()

    if (currentStatus !== column) {
      onDragEnd(itemId, { status: column })
    }
  }

  const clearHighlights = () => {
    const indicators = Array.from(
      document.querySelectorAll<HTMLElement>(`[data-column="${column}"]`)
    )
    indicators.forEach((i) => {
      i.style.opacity = "0"
    })
  }

  const highlightIndicator = (e) => {
    const indicators = Array.from(
      document.querySelectorAll(`[data-column="${column}"]`)
    )
    clearHighlights()
    const el = getNearestIndicator(e, indicators)
    el.element.style.opacity = "1"
  }

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = e.clientY - (box.top + DISTANCE_OFFSET)
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child }
        } else {
          return closest
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    )
    return el
  }

  const handleDragLeave = () => {
    clearHighlights()
    setActive(false)
  }

  const totalItems = items?.length || 0

  return (
    <div className="group/section flex size-full flex-1 flex-col gap-4 rounded-lg">
      <div className="flex items-center gap-2 text-xl text-foreground">
        <Icon icon={icon} />
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`no-scrollbar size-full max-h-[calc(100vh-300px)] overflow-y-auto`}
      >
        {items.map((item) => (
          <Card
            key={item._id}
            {...item}
            item={item}
            handleDragStart={handleDragStart}
          />
        ))}
        <DropIndicator beforeId={null} column={column} />
        <AddCard
          column={column}
          updateItem={createItem}
          totalItems={totalItems}
        />
      </div>
    </div>
  )
}

const Card = ({ title, _id, status, handleDragStart, item }) => {
  const { currentItem, setCurrentItem } = useCycleItemStore()
  const handleExpand = (item: CycleItem) => {
    setCurrentItem(item)
  }

  return (
    <>
      <DropIndicator beforeId={_id} column={status} />
      <motion.div
        layout
        layoutId={_id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { _id, status })}
        onClick={() => {
          handleExpand(item)
        }}
        className={classNames(
          "group flex cursor-grab flex-col gap-1 rounded-lg border p-4 text-left hover:border-border active:cursor-grabbing",
          currentItem?._id == item._id
            ? "border-border bg-background-hover"
            : "border-transparent"
        )}
        data-item-id={_id}
      >
        <p className="text-sm text-neutral-100">{title}</p>
      </motion.div>
    </>
  )
}

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="mx-auto h-px w-[95%] bg-secondary-foreground opacity-0"
    />
  )
}

interface AddCardProps {
  column: string
  updateItem: (session: string, data: Partial<CycleItem>) => void
}

const AddCard = ({ column, updateItem, totalItems = 0 }) => {
  const [text, setText] = useState("")
  const [adding, setAdding] = useState(false)
  const { session } = useAuth()
  const addItemRef = useRef<HTMLDivElement>(null)
  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRefTitle.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [text])

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault()
      if (!text.trim().length) return
      const cycleDate = getEndOfCurrentWeek(new Date())
      const data = {
        cycleDate: cycleDate,
        title: text.trim(),
        status: column,
      }
      updateItem(session, data)
      handleCancel()
    },
    [updateItem, column, session, text]
  )

  const handleCancel = () => {
    setText("")
    setAdding(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        adding &&
        addItemRef.current &&
        !addItemRef.current.contains(event.target as Node)
      ) {
        handleCancel()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [adding, text, handleSubmit])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      if (text.trim().length) {
        handleSubmit()
      } else {
        handleCancel()
      }
    }
  }

  // Determine visibility class based on column and total items
  const getVisibilityClass = () => {
    if (column === "todo" && totalItems === 0) {
      return "visible" // Always visible for todo column when no items
    }
    return "invisible group-hover/section:visible" // Default hover behavior
  }

  return (
    <div ref={addItemRef} className="">
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            ref={textareaRefTitle}
            value={text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setText(e.target.value)
            }
            onKeyDown={handleKeyDown}
            autoFocus
            placeholder="title"
            className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-transparent p-4 text-sm font-bold text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
            rows={1}
          />
          <button type="submit" style={{ display: "none" }}></button>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className={`hover-bg flex w-full items-center gap-2 rounded-lg p-4 text-sm ${getVisibilityClass()}`}
        >
          <Icon icon="ic:round-plus" className="text-[18px]" />
          <p>New item</p>
        </motion.button>
      )}
    </div>
  )
}
