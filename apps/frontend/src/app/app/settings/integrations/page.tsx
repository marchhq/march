import { Heading } from "@/src/components/atoms/Heading"
import { IntegrationCard } from "@/src/components/atoms/IntegrationCard"

const Integrations = (): JSX.Element => {
  return (
    <div className="ml-20 mt-1">
      <Heading label="Integrations" />
      <div className="grid grid-cols-3 gap-2">
        <IntegrationCard />
        <IntegrationCard />
        <IntegrationCard />
        <IntegrationCard />
      </div>
    </div>
  )
}

export default Integrations
