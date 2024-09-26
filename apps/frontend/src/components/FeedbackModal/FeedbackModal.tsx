"use client"

import React, { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

import { Link as LinkIcon, Trash } from "@phosphor-icons/react"
import Link from "next/link"

import { Textarea } from "../ui/textarea"
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { useAuth } from "@/src/contexts/AuthContext"
import { useToast } from "@/src/hooks/use-toast"
import { BACKEND_URL } from "@/src/lib/constants/urls"
import { TwitterIcon } from "@/src/lib/icons/TwitterIcon"

type Inputs = {
  title: string
  feedback: string
  attachment?: FileList
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const FeedbackModal = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>()

  const { session } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)

    if (totalSize > MAX_FILE_SIZE) {
      toast({
        title: "Total file size exceeds 5MB.",
        variant: "destructive",
      })
      return
    }

    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    )

    if (validFiles.length !== files.length) {
      toast({
        title: "Only images and videos are allowed.",
        variant: "destructive",
      })
    }

    setSelectedFiles(validFiles)
  }

  const removeFile = (file: File) => {
    setSelectedFiles(selectedFiles.filter((f) => f !== file))
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading(true)
      // Prepare form data for API submission
      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("feedback", data.feedback)

      selectedFiles.forEach((file) => formData.append("attachment", file))

      const response = await fetch(`${BACKEND_URL}/api/feedback`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session}`,
        },
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Submitted successfully!",
        })

        // Clear the form fields and selected files after successful submission
        reset() // reset method from useForm
        setSelectedFiles([]) // clear the selected files
        console.log("Feedback submitted successfully!")
      } else {
        toast({
          title: "Uh oh! Error while submitting feedback.",
          variant: "destructive",
        })
        console.error("Error submitting feedback:", response.statusText)
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error("An error occurred while submitting feedback:", error)
    }
  }

  return (
    <div className="rounded-lg border border-border">
      <DialogHeader className="text-secondary-foreground">
        <DialogTitle className="mb-2 px-6 pt-5 text-base">
          Share feedback
        </DialogTitle>
      </DialogHeader>
      <form className="text-black text-foreground" onSubmit={handleSubmit(onSubmit)}>
        <div className="px-4">
          <input
            placeholder="Title"
            className="w-full mt-2 px-2 py-4 text-xl border-none bg-transparent placeholder-secondary-foreground focus:outline-none"
            {...register("title", { required: true })}
          />
          {errors.title && (
            <span className="px-3 text-xs text-red-500">Title is required</span>
          )}
          <Textarea
            className="min-h-40 text-sm border-none placeholder-secondary-foreground"
            placeholder="add description..."
            {...register("feedback", { required: true })}
          />
          {errors.feedback && (
            <span className="px-3 text-xs text-red-500">
              Feedback is required
            </span>
          )}
          <div className="my-3 cursor-pointer rounded-lg">
            <label
              htmlFor="attachment"
              className="relative flex items-center gap-2 px-2 py-1 "
            >
              <input
                className="absolute size-full rounded-lg border-primary-foreground text-primary-foreground opacity-0"
                id="attachment"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
              <div className="z-50 flex cursor-pointer items-center gap-2">
                <LinkIcon className="text-secondary-foreground" />{" "}
                <span className="text-sm text-secondary-foreground">
                  {" "}
                  Attach Files (Max: 5MB){" "}
                </span>
              </div>
            </label>
          </div>
          {selectedFiles.length > 0 && (
            <ul className="mt-2 max-h-32 overflow-y-auto pr-2 text-primary-foreground">
              {selectedFiles.map((file, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(file)}
                    className="ml-4 text-xs text-red-500"
                  >
                    <Trash />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <DialogFooter className="mt-2 border-t border-border px-6 py-2 text-primary-foreground">
          <div className="flex w-full items-center justify-between gap-2 ">
            <Link
              href={"https://x.com/_marchhq"}
              target="_blank"
              className="flex items-center gap-2 text-sm text-secondary-foreground"
            >
              <TwitterIcon /> <span>_marchhq</span>
            </Link>
            <button
              className="cursor-pointer rounded-lg px-4 py-1 text-sm text-secondary-foreground hover-bg disabled:cursor-not-allowed"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Submitting" : "Send feedback"}
            </button>
          </div>
        </DialogFooter>
      </form>
    </div>
  )
}

export default FeedbackModal
