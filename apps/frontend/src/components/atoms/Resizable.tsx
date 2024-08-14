"use client"
import * as React from "react"
import * as ResizablePrimitive from "react-resizable-panels"

import { DotsSixVertical } from "@phosphor-icons/react"

import classNames from "@/src/utils/classNames"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<
  typeof ResizablePrimitive.PanelGroup
>): React.ReactNode => (
  <ResizablePrimitive.PanelGroup
    className={classNames(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle = false,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}): React.ReactNode => (
  <ResizablePrimitive.PanelResizeHandle
    className={classNames(
      "relative flex w-1 items-center justify-center bg-black hover:bg-zinc-700 transition-colors after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-black transition-colors hover:bg-zinc-700">
        <DotsSixVertical className="size-2.5 bg-zinc-500" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
