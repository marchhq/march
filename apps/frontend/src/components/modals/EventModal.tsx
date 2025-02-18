"use client"

import React, { useEffect, useState } from "react"

import { DialogTitle } from "@radix-ui/react-dialog"
import { AlignLeft, Clock, MapPin, MoveRight } from "lucide-react"

import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { useAuth } from "@/src/contexts/AuthContext"
import { CreateEventInput } from "@/src/lib/@types/Items/event"
import { useCreateEvent } from "@/src/queries/useEvents"
import { eventColors } from "@/src/utils/colors"

export const EventModal = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [startDateTime, setStartDateTime] = useState("")
  const [endDateTime, setEndDateTime] = useState("")
  const [colorId, setColorId] = useState("1")
  const [isOpen, setIsOpen] = useState(false)

  const { session } = useAuth()
  const createEventMutation = useCreateEvent(session)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key.toLowerCase() === "c") {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const combineDateTimeToISO = (timeString: string): string => {
    if (!timeString || !date) {
      throw new Error("Date and time are required")
    }

    const selectedDate = new Date(date)
    const [hours, minutes] = timeString.split(":")

    const dateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      parseInt(hours),
      parseInt(minutes)
    )

    return dateTime.toISOString()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      // Validate required fields
      if (!date || !startDateTime || !endDateTime || !title) {
        throw new Error("Please fill in all required fields")
      }

      const eventData: CreateEventInput = {
        summary: title,
        description,
        start: {
          dateTime: combineDateTimeToISO(startDateTime),
        },
        end: {
          dateTime: combineDateTimeToISO(endDateTime),
        },
        colorId,
      }

      console.log("event data: ", eventData)
      createEventMutation.mutateAsync(eventData)
      setIsOpen(false)
      // Handle success
    } catch (error) {
      // Handle error
      console.error("Failed to create event:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Event</Label>
            <div className="flex items-center gap-2">
              <Select value={colorId} onValueChange={setColorId}>
                <SelectTrigger className="h-[30px] w-[40px] px-2">
                  <div
                    className="size-4 rounded-full"
                    style={{
                      backgroundColor: eventColors[Number(colorId) - 1]?.value,
                    }}
                  />
                </SelectTrigger>
                <SelectContent className="min-w-[120px] border-none">
                  <div className="grid grid-cols-4 gap-1">
                    {eventColors.map((color, index) => (
                      <SelectItem
                        key={color.value}
                        value={(index + 1).toString()}
                        className="flex cursor-pointer items-center justify-center rounded-sm p-1 focus:bg-neutral-100"
                      >
                        <div
                          className="size-4 rounded-full"
                          style={{ backgroundColor: color.value }}
                        />
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
              <Input
                id="title"
                name="title"
                placeholder="Add Title"
                value={title}
                className="grow"
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-gray-500" />
              <Input
                id="start-time"
                name="start-time"
                type="time"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                className="grow"
              />
            </div>
            <div className="flex items-center gap-2">
              <MoveRight className="size-4 text-primary-foreground" />
              <Input
                id="end-time"
                name="end-time"
                type="time"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                className="grow"
              />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <AlignLeft className="mt-2 size-4 text-primary-foreground" />
            <Textarea
              id="description"
              name="description"
              placeholder="Add description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="grow"
            />
          </div>
          <DialogFooter>
            <Button type="submit" variant="outline">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
