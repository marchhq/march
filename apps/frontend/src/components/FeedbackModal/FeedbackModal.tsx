"use client"

import React, { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { Textarea } from "../ui/textarea"
import { Link as LinkIcon, Paperclip, Trash } from "@phosphor-icons/react"
import { BACKEND_URL } from "@/src/lib/constants/urls"
import { useAuth } from "@/src/contexts/AuthContext"
import { useToast } from "@/src/hooks/use-toast"
import { TwitterIcon } from "@/src/lib/icons/TwitterIcon"
import Link from "next/link"

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
    <div className="border border-border rounded-lg">
      <DialogHeader className="dark:text-white">
        <DialogTitle className="px-5 pt-5 text-base">
          Share Feedback
        </DialogTitle>
      </DialogHeader>
      <form className="dark:text-white" onSubmit={handleSubmit(onSubmit)}>
        <div className="px-4">
          <input
            placeholder="Title"
            className="mt-2 dark:border-none dark:bg-transparent py-4 px-2 w-full text-xl focus:outline-none"
            {...register("title", { required: true })}
          />
          {errors.title && (
            <span className="text-red-500">Title is required</span>
          )}
          <Textarea
            className="min-h-40 dark:border-none text-sm"
            placeholder="Share feedback, feature request, or report a bug"
            {...register("feedback", { required: true })}
          />
          {errors.feedback && (
            <span className="text-red-500">Feedback is required</span>
          )}
          <div className="my-3 cursor-pointer rounded-lg">
            <label
              htmlFor="attachment"
              className="relative px-2 py-1 flex items-center gap-2 "
            >
              <input
                className="absolute w-full h-full opacity-0 border-primary-foreground rounded-lg"
                id="attachment"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
              <div className="cursor-pointer z-50 flex gap-2 items-center">
                <LinkIcon />{" "}
                <span className="text-primary-foreground">
                  {" "}
                  Attach Files (Max: 5MB){" "}
                </span>
              </div>
            </label>
          </div>
          {selectedFiles.length > 0 && (
            <ul className="mt-2 max-h-32 overflow-y-auto pr-2">
              {selectedFiles.map((file, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(file)}
                    className="text-red-500 ml-4"
                  >
                    <Trash />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <DialogFooter className="px-4 py-2 border-t border-border">
          <div className="flex gap-2 items-center justify-between w-full">
            <Link
              href={"https://x.com/_marchhq"}
              target="_blank"
              className="flex gap-2 items-center"
            >
              <TwitterIcon /> <span>_marchhq</span>
            </Link>
            <button
              className="px-4 py-1 cursor-pointer rounded-lg hover:bg-secondary-foreground  text-black dark:text-white hover:text-white  transition-colors duration-300 ease-linear hover:dark:bg-primary-foreground hover:dark:text-black"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Submitting" : "Submit"}
            </button>
          </div>
        </DialogFooter>
      </form>
    </div>
  )
}

export default FeedbackModal
