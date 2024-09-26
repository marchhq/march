"use client"


import React, { useEffect } from "react"
import Image from "next/image"
import React, { useEffect, useState } from "react"

import { Icon } from "@iconify-icon/react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"

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

  const router = useRouter()

  const { session } = useAuth()

  const { showModal } = useModal()

  const [lastSpaceRoute, setLastSpaceRoute] = useState<string | null>(null)

  if (pathname.includes("auth")) {
    return null
  }

  useEffect(() => {
    if (pathname.startsWith("/space/")) {
      setLastSpaceRoute(pathname)
    }
  }, [pathname])

  const handleSpaceClick = () => {
    if (lastSpaceRoute) {
      router.push(lastSpaceRoute)
    }
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks

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
<div className="relative mx-4 my-auto flex flex-col group rounded-[30px] border border-border bg-background px-2 py-4 h-[200px] w-[60px] hover:h-[520px] hover:transition-all duration-300 ease-in-out overflow-hidden">
<div className="flex flex-col gap-2">
        <SidebarLink
          href={"/inbox"}
          icon={<Icon icon="hugeicons:inbox" style={{ fontSize: "28px" }} />}
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
                "border-2 rounded-md py-0.5 px-1 text-xs font-medium"
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
            <Icon
              icon="fluent:collections-20-filled"
              style={{ fontSize: "30px " }}
            />
          }
          label="space"
          isActive={pathname.includes("/space/")}
        />
        {/* Feedback 
        <button onClick={handleSpaceClick}>
          <SidebarLink
            href={"/space"}
            icon={
              <Icon
                icon="fluent:collections-20-filled"
                style={{ fontSize: "28px " }}
              />
            }
            label="space"
            isActive={pathname.includes("/space/")}
          />
        </button>
        {/* Feedback */}

        <div
          className={classNames(navLinkClassName, "text-secondary-foreground")}
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
            style={{ fontSize: "28px " }}
          />
        </div>
        */}
      </div> 
      <div className="hidden group-hover:flex flex-col gap-4 mt-6">
        <SidebarLink
          href="/record/"
          icon={<svg fill="none" 
            height="24"
             viewBox="0 0 24 24"
            width="24" 
            xmlns="http://www.w3.org/2000/svg">
              <path d="M11 21L11 3C11 2.44772 11.4477 2 12 2C12.5523 2 13 2.44772 13 3L13 21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21Z" fill="grey"/>
              <path d="M15 4C15.5523 4 16 4.44772 16 5L16 19C16 19.5523 15.5523 20 15 20C14.4477 20 14 19.5523 14 19L14 5C14 4.44772 14.4477 4 15 4Z" fill="grey"/>
              <path d="M19 8C19 7.44772 18.5523 7 18 7C17.4477 7 17 7.44772 17 8L17 16C17 16.5523 17.4477 17 18 17C18.5523 17 19 16.5523 19 16L19 8Z" fill="grey"/>
              <path d="M21 10C21.5523 10 22 10.4477 22 11L22 14C22 14.5523 21.5523 15 21 15C20.4477 15 20 14.5523 20 14L20 11C20 10.4477 20.4477 10 21 10Z" fill="grey"/>
              <path d="M10 5C10 4.44772 9.55229 4 9 4C8.44772 4 8 4.44772 8 5L8 19C8 19.5523 8.44772 20 9 20C9.55229 20 10 19.5523 10 19L10 5Z" fill="grey"/>
              <path d="M6 7C6.55229 7 7 7.44772 7 8L7 16C7 16.5523 6.55228 17 6 17C5.44772 17 5 16.5523 5 16L5 8C5 7.44772 5.44772 7 6 7Z" fill="grey"/>
              <path d="M4 11C4 10.4477 3.55229 10 3 10C2.44772 10 2 10.4477 2 11V14C2 14.5523 2.44771 15 3 15C3.55228 15 4 14.5523 4 14L4 11Z" fill="grey"/>
              </svg>}
          label="Record" isActive={false}        />
        <SidebarLink
          href="/profile/"
          icon={<Image
            src={data ? data.avatar : "/icons/user.jpg"}
            alt="profile"
            width={26}
            height={26}
            className="rounded-full" />}
          label="profile" isActive={false}        />
        <SidebarLink
         href="/mode/"
         icon={
           <svg
             width="24"
             height="24"
             viewBox="0 0 102.05 102.05"
             fill="none"
             xmlns="http://www.w3.org/2000/svg"
           >
             <path
               stroke="white"
               fill="none"
               strokeWidth="2"
               d="M50.51,51.42a34.94,34.94,0,0,1-9.76-29.91A30.77,30.77,0,1,0,80.92,61.1A34.86,34.86,0,0,1,50.51,51.42Z"
             />
             <path
               stroke="white"
               fill="#161616"
               strokeWidth="2"
               d="M85.29,57a2,2,0,0,0-1.94-.5A30.76,30.76,0,0,1,45.34,19a2,2,0,0,0-2.47-2.43A34.77,34.77,0,1,0,85.82,58.9,2,2,0,0,0,85.29,57ZM74,71.83a30.77,30.77,0,1,1-33.2-50.32A34.74,34.74,0,0,0,80.92,61.1,30.79,30.79,0,0,1,74,71.83Z"
             />
           </svg>
         }
          label="mode" isActive={false} />
        <SidebarLink
          href="/info/"
          icon={<svg
            width="22"
            height="23"
            viewBox="0 0 22 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.0491 21.3315C16.572 21.3315 21.0491 16.8544 21.0491 11.3315C21.0491 5.8087 16.572 1.33154 11.0491 1.33154C5.52629 1.33154 1.04913 5.8087 1.04913 11.3315C1.04913 16.8544 5.52629 21.3315 11.0491 21.3315Z"
              stroke={pathname === "/info/" ? "#000" : "#676767"}
              strokeWidth="1.5" />
            <path
              d="M9.04913 8.33154C9.04913 7.22697 9.94453 6.33154 11.0491 6.33154C12.1537 6.33154 13.0491 7.22697 13.0491 8.33154C13.0491 8.72969 12.9328 9.10067 12.7322 9.41234C12.1345 10.3412 11.0491 11.2269 11.0491 12.3315V12.8315"
              stroke={pathname === "/info/" ? "#000" : "#676767"}
              strokeWidth="1.5"
              strokeLinecap="round" />
            <path
              d="M11.0413 16.3315H11.0503"
              stroke={pathname === "/info/" ? "#000" : "#676767"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round" />
          </svg>}

          label="Feedback" isActive={false}        />
      </div>
      
    </div>
  )
}

export default Sidebar
