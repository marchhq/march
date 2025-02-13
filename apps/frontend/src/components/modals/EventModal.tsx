"use client"

import { FormEvent, useEffect, useState } from "react"

import { DialogTitle } from "@radix-ui/react-dialog"
import { AlignLeft, Clock, MapPin, MoveRight } from "lucide-react"

import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { roundToNext15 } from "@/src/utils/datetime"

export const EventModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [defaultDate] = useState(new Date().toISOString().split("T")[0])
  const now = new Date()
  const startTime = roundToNext15(new Date(now)) // Rounded current time
  const endTime = new Date(startTime.getTime() + 15 * 60000) // +15 min

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const title = formData.get("title") as string
    const date = formData.get("date") as string
    const startTime = formData.get("start-time") as string
    const endTime = formData.get("end-time") as string
    const location = formData.get("location") as string
    const description = formData.get("description") as string

    const start = `${date} ${startTime}`
    const end = `${date} ${endTime}`

    setIsOpen(false)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if the pressed key is 'c' and ctrl key is held
      if (event.ctrlKey && event.key.toLowerCase() === "c") {
        // Prevent the default browser copy behavior
        event.preventDefault()
        setIsOpen(true)
      }
    }

    // Add event listener
    document.addEventListener("keydown", handleKeyDown)

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, []) // Empty dependency array means this effect runs once on mount

  const formatTime = (date: Date) => date.toTimeString().slice(0, 5)
  const [defaultStartTime] = useState(formatTime(startTime))
  const [defaultEndTime] = useState(formatTime(endTime))

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-4 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Event</Label>
            <Input id="title" name="title" placeholder="add Title" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              name="date"
              defaultValue={defaultDate}
            />
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primary-foreground" />
            <Input
              id="location"
              name="location"
              placeholder="add location"
              className="grow"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-gray-500" />
              <Input
                id="start-time"
                name="start-time"
                type="time"
                className="grow"
                defaultValue={defaultStartTime}
              />
            </div>
            <div className="flex items-center gap-2">
              <MoveRight className="size-4 text-primary-foreground" />
              <Input
                id="end-time"
                name="end-time"
                type="time"
                className="grow"
                defaultValue={defaultEndTime}
              />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <AlignLeft className="mt-2 size-4 text-primary-foreground" />
            <Textarea
              id="description"
              name="description"
              placeholder="add description"
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
