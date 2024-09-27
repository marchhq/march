import React, { useCallback, useEffect, useRef, useState } from "react"

import type { MenuListProps } from "./types"
import { DropdownButton } from "@/src/components/Dropdown"
import { Icon } from "@/src/components/Icon"
import { Surface } from "@/src/components/Surface"
import { cn } from "@/lib/utils"

export const MenuList = React.forwardRef((props: MenuListProps, ref) => {
  const scrollContainer = useRef<HTMLDivElement>(null)
  const activeItem = useRef<HTMLButtonElement>(null)
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)

  useEffect(() => {
    setSelectedGroupIndex(0)
    setSelectedCommandIndex(0)
  }, [props.items])

  const selectItem = useCallback(
    (groupIndex: number, commandIndex: number) => {
      const command = props.items[groupIndex].commands[commandIndex]
      props.command(command)
    },
    [props]
  )

  React.useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: React.KeyboardEvent }) => {
      if (event.key === "ArrowDown") {
        if (!props.items.length) {
          return false
        }

        const commands = props.items[selectedGroupIndex].commands

        let newCommandIndex = selectedCommandIndex + 1
        let newGroupIndex = selectedGroupIndex

        if (commands.length - 1 < newCommandIndex) {
          newCommandIndex = 0
          newGroupIndex = selectedGroupIndex + 1
        }

        if (props.items.length - 1 < newGroupIndex) {
          newGroupIndex = 0
        }

        setSelectedCommandIndex(newCommandIndex)
        setSelectedGroupIndex(newGroupIndex)

        return true
      }

      if (event.key === "ArrowUp") {
        if (!props.items.length) {
          return false
        }

        let newCommandIndex = selectedCommandIndex - 1
        let newGroupIndex = selectedGroupIndex

        if (newCommandIndex < 0) {
          newGroupIndex = selectedGroupIndex - 1
          newCommandIndex = props.items[newGroupIndex]?.commands.length - 1 || 0
        }

        if (newGroupIndex < 0) {
          newGroupIndex = props.items.length - 1
          newCommandIndex = props.items[newGroupIndex].commands.length - 1
        }

        setSelectedCommandIndex(newCommandIndex)
        setSelectedGroupIndex(newGroupIndex)

        return true
      }

      if (event.key === "Enter") {
        if (
          !props.items.length ||
          selectedGroupIndex === -1 ||
          selectedCommandIndex === -1
        ) {
          return false
        }

        selectItem(selectedGroupIndex, selectedCommandIndex)

        return true
      }

      return false
    },
  }))

  useEffect(() => {
    if (activeItem.current && scrollContainer.current) {
      const offsetTop = activeItem.current.offsetTop
      const offsetHeight = activeItem.current.offsetHeight

      scrollContainer.current.scrollTop = offsetTop - offsetHeight
    }
  }, [selectedCommandIndex, selectedGroupIndex])

  const createCommandClickHandler = useCallback(
    (groupIndex: number, commandIndex: number) => {
      return () => {
        selectItem(groupIndex, commandIndex)
      }
    },
    [selectItem]
  )

  if (!props.items.length) {
    return null
  }

  return (
    <Surface
      ref={scrollContainer}
      className="mb-8 max-h-[min(80vh,24rem)] overflow-auto p-2 dark:bg-background border-[#3A3A3A]"
    >
      <div className="grid grid-cols-1 gap-0.5 text-zinc-300">
        {props.items.map((group, groupIndex) => (
          <React.Fragment key={`${group.title}-wrapper`}>
            <div
              className={cn(
                "col-[1/-1] mx-2 mt-4 select-none text-[0.65rem] font-semibold uppercase tracking-wider text-neutral-500 first:mt-0.5",
                groupIndex == 0 && "mt-0"
              )}
              key={`${group.title}`}
            >
              {group.title}
            </div>
            {group.commands.map((command, commandIndex) => (
              <React.Fragment key={`${command.label}`}>
                <DropdownButton
                  ref={
                    selectedGroupIndex === groupIndex &&
                    selectedCommandIndex === commandIndex
                      ? activeItem
                      : null
                  }
                  isActive={
                    selectedGroupIndex === groupIndex &&
                    selectedCommandIndex === commandIndex
                  }
                  onClick={createCommandClickHandler(groupIndex, commandIndex)}
                >
                  <Icon name={command.iconName} className="mr-1" />
                  {command.label}
                </DropdownButton>
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>
    </Surface>
  )
})

MenuList.displayName = "MenuList"

export default MenuList
