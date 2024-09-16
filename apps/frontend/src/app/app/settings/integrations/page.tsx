import { Heading } from "@/src/components/atoms/Heading"
import { IntegrationCard } from "@/src/components/atoms/IntegrationCard"

const Integrations = (): JSX.Element => {
  return (
    <div className="ml-20 mt-1">
      <Heading label="Integrations" />
      <IntegrationCard />
    </div>
  )
}

export default Integrations
