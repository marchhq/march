import Link from "next/link"

import CalendarLogin from "@/src/components/login/CalendarLogin"

const CalendarConnect = () => {
  return (
    <main className="flex h-full flex-col items-center justify-between">
      <div className="flex size-3/4 flex-col items-center justify-center gap-12">
        <div className="flex flex-col justify-center gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="font-medium">
              Connect Your{" "}
              <span className="text-primary-foreground">calendar</span>
            </h1>
            <p className="max-w-[320px] pl-1 text-start text-xs font-semibold text-secondary-foreground">
              sync your daily agenda with march and take notes
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-2 text-base">
          <CalendarLogin />
        </div>
      </div>
      <div className="w-full text-sm text-secondary-foreground">
        <div className="text-center">
          <Link href={"/stack"}>
            <button className="hover-text">I&apos;ll do this later</button>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default CalendarConnect
