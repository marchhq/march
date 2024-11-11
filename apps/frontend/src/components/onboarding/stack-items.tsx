import { Card } from "../card/Card"

export const StackItems = ({ integration, connected, onConnect }) => {
  const handleConnect = async () => {
    try {
      onConnect()
    } catch (e) {
      console.error("failed to connect: ", e)
    }
  }

  return (
    <Card onClick={handleConnect}>
      <main className="flex flex-1 flex-col gap-6">
        <section className="flex justify-start gap-2">
          <div className="size-4">{integration.icon}</div>
          <div>
            <p className="text-xs">{integration.name}</p>
            {connected && (
              <p className="text-left text-[10px] font-medium text-secondary-foreground">
                Enabled
              </p>
            )}
          </div>
        </section>
        <section className="pb-8">
          <p className="text-start text-xs font-semibold text-secondary-foreground">
            {integration.description}
          </p>
        </section>
      </main>
    </Card>
  )
}
