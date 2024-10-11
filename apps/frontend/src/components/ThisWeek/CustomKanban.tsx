import React, { useCallback, useEffect, useRef, useState } from "react"

import { Icon } from "@iconify-icon/react"
import { motion } from "framer-motion"

import { useAuth } from "@/src/contexts/AuthContext"
import useItemsStore from "@/src/lib/store/items.store"

export const CustomKanban = () => {
  return (
    <div className="w-full">
      <Board />
    </div>
  )
}

const Board = () => {
  const { items, fetchItems, mutateItem } = useItemsStore()
  const { session } = useAuth()

  useEffect(() => {
    fetchItems(session, "this-week")
  }, [session, fetchItems])

  const handleDragEnd = (itemId: string, newStatus: string) => {
    mutateItem(session, itemId, newStatus)
  }

  return (
    <div className="flex size-full gap-3 overflow-scroll p-12">
      <Column
        title="todo"
        column="todo"
        items={items.filter((item) => item.status === "todo")}
        onDragEnd={handleDragEnd}
        icon="material-symbols:circle-outline"
      />
      <Column
        title="in progress"
        column="in progress"
        items={items.filter((item) => item.status === "in progress")}
        onDragEnd={handleDragEnd}
        icon="carbon:circle-dash"
      />
      <Column
        title="done"
        column="done"
        items={items.filter((item) => item.status === "done")}
        onDragEnd={handleDragEnd}
        icon="material-symbols:circle"
      />
    </div>
  )
}

const Column = ({ title, items, column, onDragEnd, icon }) => {
  const { addItem } = useItemsStore()
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
      onDragEnd(itemId, column)
    }
  }

  const clearHighlights = () => {
    const indicators = Array.from(
      document.querySelectorAll(`[data-column="${column}"]`)
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

  return (
    <div className="group/section flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-2 text-xl text-foreground">
        <Icon icon={icon} />
        <h2>{title}</h2>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`size-full`}
      >
        {items.map((item) => (
          <Card key={item._id} {...item} handleDragStart={handleDragStart} />
        ))}
        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} addItem={addItem} />
      </div>
    </div>
  )
}

const Card = ({ title, _id, status, handleDragStart }) => {
  return (
    <>
      <DropIndicator beforeId={_id} column={status} />
      <motion.div
        layout
        layoutId={_id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { _id, status })}
        className="group flex cursor-grab flex-col gap-1 rounded-lg border border-transparent p-4 text-left hover:border-border active:cursor-grabbing"
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
      className="h-px w-full bg-secondary-foreground opacity-0"
    />
  )
}

interface AddCardProps {
  column: string
  addItem: (
    session: string,
    dueDate: string,
    title: string,
    status: string
  ) => void
}

const AddCard: React.FC<AddCardProps> = ({ column, addItem }) => {
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

      console.log("Attempting to add item:", {
        session,
        dueDate: new Date().toISOString(),
        title: text.trim(),
        status: column,
      })

      addItem(session, new Date().toISOString(), text.trim(), column)
      handleCancel()
    },
    [addItem, column, session, text]
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
        if (text.trim().length) {
          handleSubmit()
        } else {
          handleCancel()
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [adding, text, handleSubmit])

  return (
    <div ref={addItemRef}>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            ref={textareaRefTitle}
            value={text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setText(e.target.value)
            }
            placeholder="title"
            className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-transparent py-1 text-base font-bold text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
            rows={1}
          />
          <button type="submit" style={{ display: "none" }}></button>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="hover-bg flex w-full items-center gap-2 rounded-lg p-4 text-sm"
        >
          <Icon icon="ic:round-plus" className="text-[18px]" />
          <p>New item</p>
        </motion.button>
      )}
    </div>
  )
}
