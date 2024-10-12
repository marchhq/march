import { LoadingLogo } from "../lib/icons/Logo"

const loading = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-[#101010]">
      <div className="flex flex-col justify-center items-center gap-12">
        <div className="relative">
          <div className="absolute inset-0 rounded-full border-2 border-[#464748] animate-pulsate"></div>
          <div className="rounded-full p-3 relative z-10">
            <LoadingLogo />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-5">
          <p className="text-[#EDEDED]">sit tight, loading some javascripts</p>
          <p className="dark:text-neutral-600">— written by our interns;</p>
        </div>
      </div>
    </div>
  )
}

export default loading
