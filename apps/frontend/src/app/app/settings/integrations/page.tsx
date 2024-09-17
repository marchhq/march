import { Heading } from "@/src/components/atoms/Heading"
import { IntegrationCard } from "@/src/components/atoms/IntegrationCard"

const Integrations = (): JSX.Element => {
  return (
    <div className="ml-28 mt-1 text-gray-color">
      <Heading label="Integrations" />
      <div className="mt-8 flex flex-wrap gap-8">
        <IntegrationCard />
        <IntegrationCard />
        <IntegrationCard />
        <IntegrationCard />
        {/* more cards here */}
      </div>
    </div>
  )
}

export default Integrations
