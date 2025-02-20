import { Block } from "@/components/blocks/block";
import ListBlock from "@/components/blocks/list/list";
import { ErrorBoundary } from "@/components/error/error-boundary";
import { InboxSkeleton } from "@/components/skeleton/inbox-skeleton";
import { Suspense } from "react";

export default function Inbox() {
  return (
    <div className="container max-w-2xl px-4 py-8">
      <ErrorBoundary
        fallback={<div>Error loading inbox. Please try again later.</div>}
      >
        <Suspense fallback={<InboxSkeleton />}>
          <Block id="list-only">
            <ListBlock header="Inbox" />
          </Block>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
