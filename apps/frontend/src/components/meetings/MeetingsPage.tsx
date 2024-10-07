import { Header } from "./Header"
import { Stack } from "./Stack"

const MeetingPage: React.FC = () => {


  return (
    <main className="p-16 h-full text-gray-color flex justify-between">
      <section>
        <Header />
      </section>
      <section className="max-w-[200px] text-sm w-full text-secondary-foreground">
        <Stack />
      </section>
    </main >
  )
}

export default MeetingPage
