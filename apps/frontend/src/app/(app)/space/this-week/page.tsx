"use client"

import { Icon } from "@iconify-icon/react"

import React from "react"
import { LeftChevron, RightChevron } from "@/src/lib/icons/Navigation"

const ThisWeekPage: React.FC = () => {
  return (
    <div className="size-full overflow-auto bg-background p-16 text-secondary-foreground">
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
          <div className="flex flex-col flex-1 gap-4">
            <div className="text-xl text-foreground">
              <h2>to do</h2>
            </div>
            <div className="flex flex-col text-left gap-1 p-4 border border-border rounded-lg hover-bg group">
              <div className="flex justify-between text-foreground">
                <div className="w-full flex items-start gap-2">
                  <Icon
                    icon="ri:github-fill"
                    style={{ fontSize: "18px" }}
                    className="mt-0.5"
                  />
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
          </div>
          <div className="flex flex-col flex-1 gap-4">
            <div className="text-xl text-foreground">
              <h2>in progress</h2>
            </div>
            <div className="flex flex-col text-left gap-1 p-4 border border-border rounded-lg hover-bg group">
              <div className="flex justify-between text-foreground">
                <div className="w-full flex items-start gap-2">
                  <Icon
                    icon="ri:github-fill"
                    style={{ fontSize: "18px" }}
                    className="mt-0.5"
                  />
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
          </div>
          <div className="flex flex-col flex-1 gap-4">
            <div className="text-xl text-foreground">
              <h2>done</h2>
            </div>
            <div className="flex flex-col text-left gap-1 p-4 border border-border rounded-lg hover-bg group">
              <div className="flex justify-between text-foreground">
                <div className="w-full flex items-start gap-2">
                  <Icon
                    icon="ri:github-fill"
                    style={{ fontSize: "18px" }}
                    className="mt-0.5"
                  />
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThisWeekPage
