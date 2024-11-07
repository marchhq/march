"use client"

import React, { useState, useEffect, useCallback } from "react"

import { format } from "date-fns"
import { CalendarIcon, MoveIcon, GithubIcon, MailsIcon } from "lucide-react"
import { XIcon } from "lucide-react"
import Image from "next/image"

import BoxIcon from "@/public/icons/box.svg"
import ChevronDownIcon from "@/public/icons/chevrondown.svg"
import ChevronRightIcon from "@/public/icons/chevronright.svg"
import LinearIcon from "@/public/icons/linear.svg"
import { RescheduleCalendar } from "@/src/components/Inbox/RescheduleCalendar/RescheduleCalendar"
import { useAuth } from "@/src/contexts/AuthContext"
import { CycleItem } from "@/src/lib/@types/Items/Cycle"
import { useCycleItemStore } from "@/src/lib/store/cycle.store"
import classNames from "@/src/utils/classNames"
import { getWeekDates } from "@/src/utils/datetime"

interface TodayEventsProps {
  selectedDate: Date
}

export const TodayItems: React.FC<TodayEventsProps> = ({
  selectedDate,
}): JSX.Element => {
  const { session } = useAuth()

  const [isControlHeld, setIsControlHeld] = useState(false)
  const [dateChanged, setDateChanged] = useState(false)
  const [reschedulingItemId, setReschedulingItemId] = useState<string | null>(
    null
  )
  const [date, setDate] = useState<Date | null>(new Date())
  const [cycleDate, setCycleDate] = useState<Date | null>(new Date())
  const [toggleOverdue, setToggleOverdue] = useState(false)
  const {
    byDate,
    overdue,
    fetchByDate,
    fetchOverdue,
    updateItem,
    error,
    currentItem,
    setCurrentItem,
    deleteItem,
  } = useCycleItemStore()

  const {
    items: byDateItems,
    error: byDateError,
    isLoading: byDateIsLoading,
  } = byDate
  const {
    items: overdueItems,
    error: overdueError,
    isLoading: overdueIsLoading,
  } = overdue

  useEffect(() => {
    const date = format(selectedDate, "yyyy-MM-dd").toLowerCase()
    fetchByDate(session, date)
    fetchOverdue(session, date)
  }, [session, selectedDate, fetchOverdue, fetchByDate])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Control" && event.location === 1) {
        setIsControlHeld(true)
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Control" && event.location === 1) {
        setIsControlHeld(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  useEffect(() => {
    if (dateChanged) {
      if (reschedulingItemId) {
        if (cycleDate) {
          const { startDate, endDate } = getWeekDates(cycleDate)
          updateItem(
            session,
            {
              status: "todo",
              dueDate: date,
              cycle: {
                startsAt: startDate,
                endsAt: endDate,
              },
            },
            reschedulingItemId
          )
        } else {
          updateItem(
            session,
            { status: date ? "todo" : "null", dueDate: date },
            reschedulingItemId
          )
        }
      }
      setReschedulingItemId(null)
      setDateChanged(false)
    }
  }, [date, cycleDate, updateItem, session, reschedulingItemId, dateChanged])

  const handleExpand = useCallback(
    (item: CycleItem) => {
      if (isControlHeld && item.type === "link") {
        window.open(item.metadata?.url, "_blank")
      } else if (!currentItem || currentItem._id !== item._id) {
        setCurrentItem(item)
      }
    },
    [currentItem, setCurrentItem, isControlHeld]
  )

  const handleDone = useCallback(
    (
      event: React.MouseEvent,
      id: string,
      currentStatus: string | undefined
    ) => {
      event.stopPropagation()
      if (id) {
        const newStatus = currentStatus === "done" ? "null" : "done"
        const today = new Date()
        const { startDate, endDate } = getWeekDates(today)
        updateItem(
          session,
          {
            status: newStatus,
            dueDate: today,
            cycle: {
              startsAt: startDate,
              endsAt: endDate,
            },
          },
          id
        )
      }
    },
    [updateItem, session]
  )

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "gmail":
        return <MailsIcon size={14} />
      case "githubIssue":
      case "githubPullRequest":
        return <GithubIcon size={14} />
      case "linear":
        return (
          <Image
            src={LinearIcon}
            alt="linear icon"
            width={14}
            height={14}
            className="opacity-50"
          />
        )
      case "march":
      case "marchClipper":
        return null
      default:
        return null
    }
  }

  const handleRescheduleCalendar = (
    e: React.MouseEvent,
    id: string,
    dueDate: Date | null
  ) => {
    e.stopPropagation()

    const newDate = dueDate
      ? typeof dueDate === "string"
        ? new Date(dueDate)
        : dueDate
      : null

    setReschedulingItemId(id)
    setDate(newDate)
  }

  const handleDelete = useCallback(
    (event: React.MouseEvent, id: string) => {
      event.stopPropagation()
      if (id) {
        deleteItem(session, id)
      }
    },
    [deleteItem, session]
  )

  const handleOverdue = () => {
    setToggleOverdue(!toggleOverdue)
  }

  if (byDateItems.length + overdueItems.length > 0) {
    return (
      <div className="no-scrollbar flex h-full flex-col gap-4 pb-5">
        <div>
          {byDateError && (
            <div className="mb-2.5 truncate pl-5 text-xs text-danger-foreground">
              <span>{byDateError}</span>
            </div>
          )}
          {error && (
            <div className="mb-2.5 truncate pl-5 text-xs text-danger-foreground">
              <span>{error}</span>
            </div>
          )}
          <div className="flex flex-col gap-2.5">
            {byDateItems.map((item) => (
              <button
                key={item._id}
                className={classNames(
                  "group flex items-start gap-2 py-1 outline-none",
                  item.status === "done"
                    ? "line-through text-secondary-foreground focus:text-secondary-foreground"
                    : "text-primary-foreground hover-text-foreground hover:text-foreground focus:text-foreground"
                )}
                onClick={() => handleExpand(item)}
                data-item-id={item._id}
              >
                <div className="flex items-start gap-2 truncate">
                  <Image
                    src={BoxIcon}
                    alt="checkbox icon"
                    width={12}
                    height={12}
                    onClick={(e) => handleDone(e, item._id, item.status)}
                    className="invisible mt-1 opacity-50 hover:opacity-100 group-hover:visible"
                  />
                  <span
                    className={classNames(
                      "text-left truncate",
                      item.type === "link" && "group-hover:underline"
                    )}
                  >
                    {item.title}
                  </span>
                  {item.source !== "march" && (
                    <div className="mt-[3px] flex items-center text-secondary-foreground">
                      {getSourceIcon(item.source)}
                    </div>
                  )}
                </div>
                <div className="invisible mt-[3px] flex items-center gap-2 text-secondary-foreground group-hover:visible">
                  <CalendarIcon
                    size={14}
                    className="hover-text"
                    onClick={(e) =>
                      handleRescheduleCalendar(e, item._id, item.dueDate)
                    }
                  />
                  <MoveIcon
                    size={14}
                    className="hover-text"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <XIcon
                    size={14}
                    className="hover-text"
                    onClick={(e) => handleDelete(e, item._id)}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 pl-5 text-secondary-foreground">
          <button
            className="flex min-h-5 items-center gap-2 font-medium outline-none"
            onClick={handleOverdue}
          >
            <span>overdue</span>
            {toggleOverdue ? (
              <Image
                src={ChevronDownIcon}
                alt="chevron down icon"
                width={12}
                height={12}
                className="mt-0.5 opacity-50"
              />
            ) : (
              <Image
                src={ChevronRightIcon}
                alt="chevron right icon"
                width={12}
                height={12}
                className="mt-0.5 opacity-50"
              />
            )}
          </button>
          {toggleOverdue && (
            <div>
              {overdueItems.length === 0 ? (
                <span className="pl-5 text-secondary-foreground">
                  no overdue items
                </span>
              ) : (
                <div className="mt-1">
                  {overdueError && (
                    <div className="mb-2.5 truncate pl-5 text-xs text-danger-foreground">
                      <span>{overdueError}</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-2.5">
                    {overdueItems.map((item) => (
                      <button
                        key={item._id}
                        className="hover-text group flex items-start gap-2 py-1 text-primary-foreground outline-none hover:text-foreground focus:text-foreground"
                        onClick={() => handleExpand(item)}
                        data-item-id={item._id}
                      >
                        <div className="flex items-start gap-2 truncate">
                          <Image
                            src={BoxIcon}
                            alt="checkbox icon"
                            width={12}
                            height={12}
                            onClick={(e) =>
                              handleDone(e, item._id, item.status)
                            }
                            className="invisible mt-1 opacity-50 hover:opacity-100 group-hover:visible"
                          />
                          <span
                            className={classNames(
                              "flex gap-1 text-left truncate",
                              item.type === "link" && "group-hover:underline"
                            )}
                          >
                            {item.title}
                            <span className="mt-1 inline-block size-1 shrink-0 rounded-full bg-[#E34136]/80" />
                          </span>
                          {item.source !== "march" && (
                            <div className="mt-[3px] flex items-center text-secondary-foreground">
                              {getSourceIcon(item.source)}
                            </div>
                          )}
                        </div>
                        <div className="invisible mt-[3px] flex items-center gap-2 text-secondary-foreground group-hover:visible">
                          <CalendarIcon
                            size={14}
                            className="hover-text"
                            onClick={(e) =>
                              handleRescheduleCalendar(
                                e,
                                item._id,
                                item.dueDate
                              )
                            }
                          />
                          <MoveIcon
                            size={14}
                            className="hover-text"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <XIcon
                            size={14}
                            className="hover-text"
                            onClick={(e) => handleDelete(e, item._id)}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {reschedulingItemId !== null && (
          <div>
            <div
              className="fixed inset-0 z-50 cursor-default bg-black/80"
              role="button"
              onClick={() => setReschedulingItemId(null)}
              onKeyDown={(e) => {
                if (e.key === "Escape" || e.key === "Esc") {
                  setReschedulingItemId(null)
                }
              }}
              tabIndex={0}
            ></div>
            <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 shadow-lg">
              <RescheduleCalendar
                date={date}
                setDate={setDate}
                cycleDate={cycleDate}
                setCycleDate={setCycleDate}
                dateChanged={dateChanged}
                setDateChanged={setDateChanged}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  return <div></div>
}
