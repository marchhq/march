import { Skeleton } from "../Skeleton"

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-3 w-[250px] bg-zinc-800 " />
      <Skeleton className="h-3 w-[200px] bg-zinc-800" />
      <Skeleton className="h-3 w-[250px] bg-zinc-800" />
    </div>
  )
}
