import { Heading } from "@/src/components/atoms/Heading"
import { PreferenceBox } from "@/src/components/atoms/Preference"

const Preference = (): JSX.Element => {
  return (
    <div className="flex min-h-screen items-center justify-center text-gray-color">
      <div className="w-full max-w-4xl px-4">
        <div className="-ml-4 mr-4">
          <Heading label="Preferences" />
        </div>
        <div className="mt-12">
          <PreferenceBox />
        </div>
      </div>
    </div>
  )
}

export default Preference
