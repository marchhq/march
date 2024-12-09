import { CircleHelp } from "lucide-react"

import FeedbackModal from "../FeedbackModal/FeedbackModal"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"

export const SidebarFeedback = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <CircleHelp className="text-primary-foreground" size={18} />
      </DialogTrigger>
      <DialogContent>
        <FeedbackModal />
      </DialogContent>
    </Dialog>
  )
}
