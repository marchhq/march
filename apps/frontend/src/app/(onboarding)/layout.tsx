import { ProgressBar } from "@/src/components/atoms/Progress"

const OnboardingLayout = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  return (
    <div className="grid h-full w-full place-content-center bg-background text-center text-muted">
      <div className="flex flex-col gap-8 h-screen w-full max-w-7xl pb-16 pt-8">
        {children}
        <ProgressBar />
      </div>
    </div>
  )
}

export default OnboardingLayout
