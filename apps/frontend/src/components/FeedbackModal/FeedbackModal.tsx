"use client"

import React, { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

import { Link as LinkIcon, Trash } from "@phosphor-icons/react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Textarea } from "../ui/textarea"
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { useAuth } from "@/src/contexts/AuthContext"
import { useModal } from "@/src/contexts/ModalProvider"
import { useToast } from "@/src/hooks/use-toast"
import { BACKEND_URL } from "@/src/lib/constants/urls"
import { TwitterIcon } from "@/src/lib/icons/TwitterIcon"
import useUserStore from "@/src/lib/store/user.store"

type Inputs = {
  email: string
  title: string
  feedback: string
  attachment?: FileList
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const FeedbackModal = () => {
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>()

  const { session } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const { user } = useUserStore()
  const { hideModal } = useModal()
  const router = useRouter()

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
      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("feedback", data.feedback)
      formData.append("email", data.email)

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
        hideModal()
        // Clear the form fields and selected files after successful submission
        reset() // reset method from useForm
        setSelectedFiles([]) // clear the selected files
        console.log("Feedback submitted successfully!")
      } else {
        // Handle response errors
        if (response.status === 401) {
          router.push("/") // Redirect to home if not authenticated
          return
        }

        const errorData = await response.json() // Get error details if available
        toast({
          title: "Uh oh! Error while submitting feedback.",
          description: errorData.message || "An unexpected error occurred.",
          variant: "destructive",
        })
        console.error(
          "Error submitting feedback:",
          response.statusText,
          errorData
        )
      }
      setIsLoading(false)
    } catch (error: unknown) {
      setIsLoading(false)
      console.error("An error occurred while submitting feedback:", error)
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    // Pre-fill user email
    setValue("email", user?.accounts.google?.email || "")
  }, [])

  return (
    <div className="rounded-lg border border-border">
      <DialogHeader className="text-secondary-foreground">
        <DialogTitle className="mb-2 px-6 pt-5 text-base">
          Share feedback
        </DialogTitle>
      </DialogHeader>
      <form className="text-foreground" onSubmit={handleSubmit(onSubmit)}>
        <div className="px-4">
          <input
            placeholder="Title"
            className="mt-2 w-full border-none bg-transparent px-2 py-3 text-xl placeholder:text-secondary-foreground focus:outline-none"
            {...register("title", { required: true })}
          />
          {errors.title && (
            <span className="px-3 text-xs text-red-500">Title is required</span>
          )}
          <Textarea
            className="min-h-40 border-none text-sm placeholder:text-secondary-foreground"
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
              className="relative flex items-center gap-2 px-2 py-1"
            >
              <input
                className="absolute size-full rounded-lg border-primary-foreground opacity-0"
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
            <ul className="mt-2 max-h-32 overflow-y-auto pr-2">
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
        <DialogFooter className="mt-2 border-t border-border px-6 py-2">
          <div className="flex w-full items-center justify-between gap-2">
            <Link
              href={"https://x.com/_marchhq"}
              target="_blank"
              className="flex items-center gap-2 rounded-lg p-1 text-sm text-secondary-foreground hover:bg-background-active"
            >
              <TwitterIcon /> <span>_marchhq</span>
            </Link>
            <button
              className="cursor-pointer rounded-lg px-4 py-1 text-sm text-secondary-foreground hover:bg-background-active disabled:cursor-not-allowed"
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
