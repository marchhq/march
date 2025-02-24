import ListBlock from "@/components/blocks/list/list";
import { ErrorBoundary } from "@/components/error/error-boundary";
import { InboxSkeleton } from "@/components/skeleton/inbox-skeleton";
import { Suspense } from "react";

export default function Inbox() {
  return (
    <section className="h-full pt-2 pl-2 pr-4">
      <div className="w-full rounded-lg bg-white min-h-[200px] md:min-h-min overflow-hidden">
        <ErrorBoundary
          fallback={<div>Error loading inbox. Please try again later.</div>}
        >
          <Suspense fallback={<InboxSkeleton />}>
            <ListBlock header="Inbox" arrayType="inbox" />
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
}
