"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/atoms/Tooltip"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"
import { BACKEND_URL } from "../lib/constants/urls"
import { type User } from "../lib/@types/auth/user"
import { Icon } from "@iconify-icon/react"
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

  if (pathname.includes("auth")) {
    return null
  }

  const { session } = useAuth()

  const today = new Date()
  const day = today.getDate()

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
    <div className="flex flex-col px-2 py-8 my-auto mx-4 border border-border rounded-[30px] bg-background select-none">
      <div className="flex flex-col gap-2">
        <SidebarLink
          href={"/inbox"}
          icon={<Icon icon="hugeicons:inbox" style={{ fontSize: "30px" }} />}
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
                "border-2 rounded-md py-0.5 px-1 text-sm font-medium"
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
      </div>
      {/* 
      <div className="flex flex-col gap-0.5">
        <SidebarLink
          href="/profile/"
          icon={
            <Image
              src={data ? data.avatar : "/icons/user.jpg"}
              alt="profile"
              width={26}
              height={26}
              className="rounded-full"
            />
          }
          label="profile"
        />
        <SidebarLink
          href="/settings/"
          icon={
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.0668 6.20845L19.5858 5.39468C19.2221 4.77924 19.0403 4.47152 18.7308 4.34881C18.4214 4.22611 18.0714 4.32293 17.3715 4.51658L16.1826 4.8431C15.7358 4.94357 15.2669 4.88657 14.8589 4.68218L14.5307 4.49752C14.1808 4.27903 13.9117 3.95689 13.7627 3.57823L13.4374 2.63072C13.2234 2.0037 13.1164 1.69019 12.8617 1.51086C12.6071 1.33154 12.2688 1.33154 11.5922 1.33154H10.506C9.82951 1.33154 9.49121 1.33154 9.23651 1.51086C8.98187 1.69019 8.87489 2.0037 8.66095 2.63072L8.33556 3.57823C8.1866 3.95689 7.91748 4.27903 7.56761 4.49752L7.23937 4.68218C6.83135 4.88657 6.36254 4.94357 5.91569 4.8431L4.72675 4.51658C4.02683 4.32293 3.67688 4.22611 3.36745 4.34881C3.05801 4.47152 2.87616 4.77924 2.51243 5.39468L2.03151 6.20845C1.69057 6.78533 1.5201 7.07378 1.55319 7.38084C1.58626 7.6879 1.81448 7.93535 2.2709 8.43024L3.2755 9.52529C3.52104 9.82834 3.69536 10.3565 3.69536 10.8314C3.69536 11.3065 3.52109 11.8345 3.27553 12.1377L2.2709 13.2328C1.81448 13.7277 1.58627 13.9751 1.55319 14.2822C1.5201 14.5893 1.69057 14.8777 2.03151 15.4545L2.51242 16.2683C2.87614 16.8837 3.05801 17.1915 3.36745 17.3142C3.67688 17.4369 4.02684 17.3401 4.72677 17.1464L5.91565 16.8199C6.36258 16.7194 6.83148 16.7765 7.23954 16.9809L7.56773 17.1656C7.91754 17.3841 8.18659 17.7061 8.33553 18.0848L8.66095 19.0324C8.87489 19.6594 8.98187 19.9729 9.23651 20.1523C9.49121 20.3315 9.82951 20.3315 10.506 20.3315H11.5922C12.2688 20.3315 12.6071 20.3315 12.8617 20.1523C13.1164 19.9729 13.2234 19.6594 13.4374 19.0324L13.7628 18.0848C13.9117 17.7061 14.1807 17.3841 14.5306 17.1656L14.8587 16.9809C15.2668 16.7765 15.7357 16.7194 16.1826 16.8199L17.3715 17.1464C18.0714 17.3401 18.4214 17.4369 18.7308 17.3142C19.0403 17.1915 19.2221 16.8837 19.5858 16.2683L20.0668 15.4545C20.4077 14.8777 20.5781 14.5893 20.5451 14.2822C20.512 13.9751 20.2838 13.7277 19.8274 13.2328L18.8227 12.1377C18.5772 11.8345 18.4029 11.3065 18.4029 10.8314C18.4029 10.3565 18.5773 9.82834 18.8227 9.52529L19.8274 8.43024C20.2838 7.93535 20.512 7.6879 20.5451 7.38084C20.5781 7.07378 20.4077 6.78533 20.0668 6.20845Z"
                stroke={pathname === "/settings/" ? "#000" : "#676767"}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M14.5491 10.8315C14.5491 12.7645 12.9821 14.3315 11.0491 14.3315C9.11611 14.3315 7.54913 12.7645 7.54913 10.8315C7.54913 8.89854 9.11611 7.33154 11.0491 7.33154C12.9821 7.33154 14.5491 8.89854 14.5491 10.8315Z"
                stroke={pathname === "/settings/" ? "#000" : "#676767"}
                strokeWidth="1.5"
              />
            </svg>
          }
          label="settings"
        />
        <SidebarLink
          href="/info/"
          icon={
            <svg
              width="22"
              height="23"
              viewBox="0 0 22 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.0491 21.3315C16.572 21.3315 21.0491 16.8544 21.0491 11.3315C21.0491 5.8087 16.572 1.33154 11.0491 1.33154C5.52629 1.33154 1.04913 5.8087 1.04913 11.3315C1.04913 16.8544 5.52629 21.3315 11.0491 21.3315Z"
                stroke={pathname === "/info/" ? "#000" : "#676767"}
                strokeWidth="1.5"
              />
              <path
                d="M9.04913 8.33154C9.04913 7.22697 9.94453 6.33154 11.0491 6.33154C12.1537 6.33154 13.0491 7.22697 13.0491 8.33154C13.0491 8.72969 12.9328 9.10067 12.7322 9.41234C12.1345 10.3412 11.0491 11.2269 11.0491 12.3315V12.8315"
                stroke={pathname === "/info/" ? "#000" : "#676767"}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M11.0413 16.3315H11.0503"
                stroke={pathname === "/info/" ? "#000" : "#676767"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          label="info"
        />
      </div>
      */}
    </div>
  )
}

export default Sidebar
