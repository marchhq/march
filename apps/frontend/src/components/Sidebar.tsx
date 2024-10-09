"use client"

import React, { useEffect, useState } from "react"

import { Icon } from "@iconify-icon/react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import FeedbackModal from "./FeedbackModal/FeedbackModal"
import { useAuth } from "../contexts/AuthContext"
import { useModal } from "../contexts/ModalProvider"
import { type User } from "../lib/@types/auth/user"
import { BACKEND_URL } from "../lib/constants/urls"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/atoms/Tooltip"
import classNames from "@/src/utils/classNames"

const navLinkClassName =
  "flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer hover-bg"

const SidebarLink = ({
  href,
  icon,
  label,
  isActive,
}: {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}) => {
  const activeClass = isActive ? "text-foreground" : "text-secondary-foreground"
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            className={classNames(navLinkClassName, activeClass)}
            href={href}
          >
            {icon}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const Sidebar: React.FC = () => {
  const pathname = usePathname()

  const { showModal } = useModal()

  const [isExpanded, setIsExpanded] = useState(false)

  if (pathname.includes("auth")) {
    return null
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { session } = useAuth()

  const today = new Date()
  const day = today.getDate()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        })
        return data as User
      } catch (error) {
        return error
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  return (
    <div
      className={classNames(
        "mx-4 my-auto flex select-none flex-col rounded-[30px] border border-border px-2 transition-all",
        isExpanded ? "py-8" : "pt-8 pb-2"
      )}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col gap-2">
        <SidebarLink
          href={"/inbox"}
          icon={<Icon icon="hugeicons:inbox" className="text-[28px]" />}
          label="inbox"
          isActive={pathname.includes("/inbox/")}
        />
        <SidebarLink
          href={"/today"}
          icon={
            <div
              className={classNames(
                pathname.includes("/today/")
                  ? "border-foreground"
                  : "border-secondary-foreground",
                "flex justify-center items-center w-[26px] h-[26px] border-2 rounded-md text-xs font-bold"
              )}
            >
              {day}
            </div>
          }
          label="today"
          isActive={pathname.includes("/today/")}
        />
        <SidebarLink
          href={"/space"}
          icon={
            <Icon icon="fluent:collections-20-filled" className="text-[28px]" />
          }
          label="space"
          isActive={pathname.includes("/space/")}
        />
        {isExpanded ? (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <SidebarLink
                href={"/profile"}
                icon={
                  // eslint-disable-next-line react/jsx-no-useless-fragment
                  <>
                    {data?.avatar ? (
                      <Image
                        src={data ? data.avatar : "icons/user.jpg"}
                        alt="profile"
                        width={26}
                        height={26}
                        className="rounded-full"
                      />
                    ) : (
                      <Icon icon="mdi:user" className="text-[28px]" />
                    )}
                  </>
                }
                label="profile"
                isActive={pathname.includes("/profile/")}
              />
            </div>
            <div
              className={classNames(
                navLinkClassName,
                "text-secondary-foreground"
              )}
              role="button"
              tabIndex={0}
              onClick={() => showModal(<FeedbackModal />)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  showModal(<FeedbackModal />)
                }
              }}
            >
              <Icon
                icon="fluent:question-circle-20-regular"
                className="text-[28px]"
              />
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-center gap-2 p-1 pb-7 rounded-lg text-secondary-foreground"
            onMouseEnter={() => setIsExpanded(true)}
          >
            ...
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
