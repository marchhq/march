import { Heading } from "@/src/components/atoms/Heading"
import { IntegrationCard } from "@/src/components/atoms/IntegrationCard"

const Integrations = (): JSX.Element => {
  return (
    <div className="flex min-h-screen items-center justify-center text-gray-color">
      <div className="w-full max-w-4xl px-4">
        <Heading label="Integrations" />
        <div className="mt-8 flex flex-wrap justify-start gap-8">
          <IntegrationCard />
          <IntegrationCard />
          <IntegrationCard />
          <IntegrationCard />
          {/* more cards here */}
        </div>
      </div>
    </div>
  )
}

export default Integrations
