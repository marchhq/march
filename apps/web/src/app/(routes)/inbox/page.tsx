import ListBlock from "@/components/blocks/list/list";
import { ErrorBoundary } from "@/components/error/error-boundary";
import { InboxSkeleton } from "@/components/skeleton/inbox-skeleton";
import { Suspense } from "react";

export default function Inbox() {
  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <ErrorBoundary
        fallback={<div>Error loading inbox. Please try again later.</div>}
      >
        <Suspense fallback={<InboxSkeleton />}>
          <ListBlock header="Inbox" />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
