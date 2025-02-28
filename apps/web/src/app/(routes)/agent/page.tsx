import { Agent } from "@/components/agent/agent";
import { ErrorBoundary } from "@/components/error/error-boundary";

export default function AgentPage() {
  return (
    <section className="h-full pl-12">
      <div className="w-full h-[calc(100vh-64px)] overflow-auto">
        <div className="w-full h-full">
          <ErrorBoundary
            fallback={<div>Error loading agent. Please try again later.</div>}
          >
            <Agent />
          </ErrorBoundary>
        </div>
      </div>
    </section>
  );
}
