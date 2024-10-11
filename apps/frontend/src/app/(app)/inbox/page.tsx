import { InboxPage } from "@/src/components/Inbox/InboxPage"

const Inbox: React.FC = () => {
  return (
    <section className="ml-[160px] h-full overflow-y-hidden bg-background p-16 text-secondary-foreground">
      <InboxPage />
    </section>
  )
}

export default Inbox
