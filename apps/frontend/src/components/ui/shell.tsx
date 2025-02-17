import { cn } from "@/src/utils/utils"
import type React from "react"

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Shell({ children, className, ...props }: ShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between gap-4 px-8">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold tracking-tight">Premium Calendar</h1>
          </div>
          <nav className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className={cn("container px-8 py-6", className)} {...props}>
          {children}
        </div>
      </main>
    </div>
  )
}
