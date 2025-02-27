import { Block } from "@/components/blocks/block";
import ListBlock from "@/components/blocks/list/list";
import { ErrorBoundary } from "@/components/error/error-boundary";
import { InboxSkeleton } from "@/components/skeleton/inbox-skeleton";
import { Suspense } from "react";

export default function Inbox() {
  return (
    <section className="pt-2 pl-2 pr-4">
      <div className="w-full rounded-lg bg-white shadow-sm h-[calc(100vh-80px)] overflow-auto border border-gray-100">
        <ErrorBoundary
          fallback={<div>Error loading inbox. Please try again later.</div>}
        >
          <Suspense fallback={<InboxSkeleton />}>
            <Block id="inbox" arrayType="inbox">
              <ListBlock header="Inbox" arrayType="inbox" />
            </Block>
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
}
