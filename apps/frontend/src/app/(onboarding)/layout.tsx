import { ProgressBar } from "@/src/components/atoms/Progress"

const OnboardingLayout = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow overflow-y-auto">{children}</main>
      <footer className="w-full p-4">
        <ProgressBar />
      </footer>
    </div>
  )
}

export default OnboardingLayout
