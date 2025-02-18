import React from "react"

import { Sparkles } from "lucide-react"

import { ChatContentPage } from "./chat-content"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"

export const Chat = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Sparkles className="size-5 text-primary-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="size-full max-h-[80vh] max-w-[50vw]">
        <div className="h-full overflow-auto">
          <ChatContentPage />
        </div>
      </DialogContent>
    </Dialog>
  )
}
