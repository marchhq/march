import { ProgressBar } from "@/src/components/atoms/Progress"
import { AuthProvider } from "@/src/contexts/AuthContext"

import type { JSX } from "react"

const OnboardingLayout = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  return (
    <AuthProvider>
      <div className="grid size-full place-content-center bg-background text-center text-muted">
        <div className="flex h-screen w-full max-w-7xl flex-col gap-8 pb-16 pt-8">
          {children}
          <ProgressBar />
        </div>
      </div>
    </AuthProvider>
  )
}

export default OnboardingLayout
