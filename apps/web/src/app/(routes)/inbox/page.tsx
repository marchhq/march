import { Block } from "@/components/blocks/block";
import ListBlock from "@/components/blocks/list/list";
import { ErrorBoundary } from "@/components/error/error-boundary";
import { InboxSkeleton } from "@/components/skeleton/inbox-skeleton";
import { Suspense } from "react";

export default function Inbox() {
  return (
    <section className="h-full pl-12">
      <div className="w-full h-[calc(100vh-64px)] overflow-auto">
        <div className="max-w-4xl">
          <ErrorBoundary
            fallback={<div>Error loading inbox. Please try again later.</div>}
          >
            <Suspense fallback={<InboxSkeleton />}>
              <Block id="inbox" arrayType="inbox">
                <ListBlock arrayType="inbox" />
              </Block>
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </section>
  );
}
