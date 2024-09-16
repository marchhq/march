import Link from "next/link"

import { Integrations } from "@/src/components/atoms/Integrations"

const StackConnect = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4 text-center text-gray-color">
      <div className="flex flex-col items-center mt-24">
        <h1 className="text-2xl font-semibold">Connect Your Stack</h1>
      </div>
      <div className="my-16 mt-12">
        <Integrations />
      </div>
      <div className="space-y-16">
        <Link href={"/timezone"}>
          <button className="flex w-60 items-center justify-center gap-x-6 rounded-2xl border border-button-stroke bg-transparent p-6 font-semibold text-black">
            Continue
          </button>
        </Link>
        <button className="hover:text-gray-900">suggest integration?</button>
      </div>
    </div>
  )
}

export default StackConnect
