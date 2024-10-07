import React from "react"

import { Icon } from "@iconify-icon/react"
import { LeftChevron, RightChevron } from "@/src/lib/icons/Navigation"

const ThisWeekComponent: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-8 text-xs">
        <h1 className="text-foreground text-2xl">Week 1</h1>
        <div className="flex gap-4">
          <p>0/6 completed</p>
          <p>0%</p>
          <p>aug 19th - aug 26th</p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => console.log("left")} className="p-2">
            <LeftChevron />
          </button>
          <button onClick={() => console.log("right")} className="p-2">
            <RightChevron />
          </button>
        </div>
      </div>
      <div className="flex w-full max-w-screen-xl gap-8">
        <div className="flex flex-col flex-1 gap-4 group/section">
          <div className="flex items-center gap-2 text-xl text-foreground">
            <Icon
              icon="material-symbols:circle-outline"
              className="text-[20px]"
            />
            <h2>to do</h2>
          </div>
          <div className="flex flex-col text-left gap-1 p-4 border border-border rounded-lg hover-bg group">
            <div className="flex justify-between text-foreground">
              <div className="w-full flex items-start gap-2">
                <Icon icon="ri:github-fill" className="mt-0.5 text-[18px]" />
                <p>title</p>
              </div>
              <div className="text-secondary-foreground text-xs">
                <button className="invisible group-hover:visible hover-text">
                  edit
                </button>
              </div>
            </div>
            <div className="ml-[18px] pl-2 text-xs">
              <p>description</p>
            </div>
          </div>
          <button className="invisible flex flex-col text-left text-sm gap-1 p-4 rounded-lg hover-bg group-hover/section:visible">
            <div className="flex items-center gap-2">
              <Icon icon="ic:round-plus" className="text-[18px]" />
              <p>New item</p>
            </div>
          </button>
        </div>
        <div className="flex flex-col flex-1 gap-4 group/section">
          <div className="flex items-center gap-2 text-xl text-foreground">
            <Icon icon="carbon:circle-dash" className="text-[20px]" />
            <h2>in progress</h2>
          </div>
          <div className="flex flex-col text-left gap-1 p-4 border border-border rounded-lg hover-bg group">
            <div className="flex justify-between text-foreground">
              <div className="w-full flex items-start gap-2">
                <Icon icon="ri:github-fill" className="mt-0.5 text-[18px]" />
                <p>title</p>
              </div>
              <div className="text-secondary-foreground text-xs">
                <button className="invisible group-hover:visible hover-text">
                  edit
                </button>
              </div>
            </div>
            <div className="ml-[18px] pl-2 text-xs">
              <p>description</p>
            </div>
          </div>
          <button className="invisible flex flex-col text-left text-sm gap-1 p-4 rounded-lg hover-bg group-hover/section:visible">
            <div className="flex items-center gap-2">
              <Icon icon="ic:round-plus" className="text-[18px]" />
              <p>New item</p>
            </div>
          </button>
        </div>
        <div className="flex flex-col flex-1 gap-4 group/section">
          <div className="flex items-center gap-2 text-xl text-foreground">
            <Icon icon="material-symbols:circle" className="text-[20px]" />
            <h2>done</h2>
          </div>
          <div className="flex flex-col text-left gap-1 p-4 border border-border rounded-lg hover-bg group">
            <div className="flex justify-between text-foreground">
              <div className="w-full flex items-start gap-2">
                <Icon icon="ri:github-fill" className="mt-0.5 text-[18px]" />
                <p>title</p>
              </div>
              <div className="text-secondary-foreground text-xs">
                <button className="invisible group-hover:visible hover-text">
                  edit
                </button>
              </div>
            </div>
            <div className="ml-[18px] pl-2 text-xs">
              <p>description</p>
            </div>
          </div>
          <button className="invisible flex flex-col text-left text-sm gap-1 p-4 rounded-lg hover-bg group-hover/section:visible">
            <div className="flex items-center gap-2">
              <Icon icon="ic:round-plus" className="text-[18px]" />
              <p>New item</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ThisWeekComponent
