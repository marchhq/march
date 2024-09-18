import { ProgressBar } from "@/src/components/atoms/Progress"

const OnboardingLayout = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="grow overflow-y-auto">{children}</main>
      <footer className="w-full p-4">
        <ProgressBar />
      </footer>
    </div>
  )
}

export default OnboardingLayout
