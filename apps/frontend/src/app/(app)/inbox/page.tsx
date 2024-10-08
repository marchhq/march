import { InboxPage } from "@/src/components/Inbox/InboxPage"

const Inbox: React.FC = () => {
  return (
    <section className="h-full overflow-y-auto bg-background ml-[160px] p-16 text-secondary-foreground">
      <InboxPage />
    </section>
  )
}

export default Inbox
