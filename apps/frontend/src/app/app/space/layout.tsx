"use client"

import React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface Props {
  children: React.ReactNode
}

const navLinkClassName =
  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-secondary-foreground cursor-pointer hover-bg"

const Space = ({
  href,
  icon,
  name,
  isActive,
}: {
  href: string
  icon: React.ReactNode
  name: string
  isActive: boolean
}) => {
  const activeClass = isActive ? "text-black" : ""
  return (
    <Link href={`/app/space/${href}`} className={navLinkClassName}>
      {icon}
      <span className={activeClass}>{name}</span>
    </Link>
  )
}

const SpaceLayout: React.FC<Props> = ({ children }) => {
  const pathname = usePathname()

  return (
    <div className="h-full flex">
      <div className="w-[160px] flex flex-col gap-0.5 px-3 pb-3 pt-14 border-r border-border bg-background text-xs ">
        <div className="flex items-center gap-2 px-3 py-2.5 text-secondary-foreground cursor-default">
          <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="24"
              height="24"
              transform="translate(0 0.540283)"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.25 7.54028C3.25 7.34137 3.32902 7.15061 3.46967 7.00995C3.61032 6.8693 3.80109 6.79028 4 6.79028H20C20.1989 6.79028 20.3897 6.8693 20.5303 7.00995C20.671 7.15061 20.75 7.34137 20.75 7.54028C20.75 7.7392 20.671 7.92996 20.5303 8.07061C20.3897 8.21127 20.1989 8.29028 20 8.29028H4C3.80109 8.29028 3.61032 8.21127 3.46967 8.07061C3.32902 7.92996 3.25 7.7392 3.25 7.54028Z"
              fill="black"
            />
            <path
              opacity="0.7"
              d="M3.25 12.5403C3.25 12.3414 3.32902 12.1506 3.46967 12.01C3.61032 11.8693 3.80109 11.7903 4 11.7903H15C15.1989 11.7903 15.3897 11.8693 15.5303 12.01C15.671 12.1506 15.75 12.3414 15.75 12.5403C15.75 12.7392 15.671 12.93 15.5303 13.0706C15.3897 13.2113 15.1989 13.2903 15 13.2903H4C3.80109 13.2903 3.61032 13.2113 3.46967 13.0706C3.32902 12.93 3.25 12.7392 3.25 12.5403Z"
              fill="black"
            />
            <path
              opacity="0.4"
              d="M3.25 17.5403C3.25 17.3414 3.32902 17.1506 3.46967 17.01C3.61032 16.8693 3.80109 16.7903 4 16.7903H9C9.19891 16.7903 9.38968 16.8693 9.53033 17.01C9.67098 17.1506 9.75 17.3414 9.75 17.5403C9.75 17.7392 9.67098 17.93 9.53033 18.0706C9.38968 18.2113 9.19891 18.2903 9 18.2903H4C3.80109 18.2903 3.61032 18.2113 3.46967 18.0706C3.32902 17.93 3.25 17.7392 3.25 17.5403Z"
              fill="black"
            />
          </svg>
          <span>Spaces</span>
        </div>

        <hr className="m-3 border-border" />
        <Space
          href="notes"
          icon={
            <svg
              width="13"
              height="14"
              viewBox="0 0 13 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.08832 1.00726C2.44185 1.00726 1.82186 1.26407 1.36475 1.72119C0.907625 2.17831 0.650818 2.7983 0.650818 3.44476V10.2698C0.650818 10.9162 0.907625 11.5362 1.36475 11.9933C1.82186 12.4505 2.44185 12.7073 3.08832 12.7073H6.66852C7.31469 12.7071 7.93437 12.4504 8.39134 11.9936L11.6371 8.74779C12.094 8.29081 12.3507 7.67114 12.3508 7.02496V3.44476C12.3508 2.7983 12.094 2.17831 11.6369 1.72119C11.1798 1.26407 10.5598 1.00726 9.91332 1.00726H3.08832ZM1.62582 3.44476C1.62582 3.05688 1.7799 2.68489 2.05417 2.41062C2.32845 2.13635 2.70044 1.98226 3.08832 1.98226H9.91332C10.3012 1.98226 10.6732 2.13635 10.9475 2.41062C11.2217 2.68489 11.3758 3.05688 11.3758 3.44476V6.85726H8.93832C8.29185 6.85726 7.67186 7.11407 7.21474 7.57119C6.75762 8.02831 6.50082 8.6483 6.50082 9.29476V11.7323H3.08832C2.70044 11.7323 2.32845 11.5782 2.05417 11.3039C1.7799 11.0296 1.62582 10.6576 1.62582 10.2698V3.44476ZM7.47582 11.4885V9.29476C7.47582 8.90688 7.6299 8.53489 7.90417 8.26062C8.17845 7.98635 8.55044 7.83226 8.93832 7.83226H11.1321C11.0788 7.91286 11.017 7.98826 10.9468 8.05846L7.70202 11.3042C7.63247 11.3731 7.55707 11.4349 7.47582 11.4895"
                fill={pathname === "/app/space/notes/" ? "#000" : "#7B7B7B"}
              />
            </svg>
          }
          name="Notes"
          isActive={pathname === "/app/space/notes/"}
        />
        <Space
          href="meeting"
          icon={
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.1106 10.6513V4.93191C11.1106 3.24684 11.1106 2.40395 10.582 1.88062C10.0533 1.3573 9.20189 1.3573 7.49969 1.3573H4.61094C2.90874 1.3573 2.05728 1.3573 1.52864 1.88062C1 2.40395 1 3.24684 1 4.93191V10.6513C1 12.3364 1 13.1786 1.52864 13.7026C2.05728 14.2266 2.90874 14.2259 4.61094 14.2259H7.49969C9.20189 14.2259 10.0533 14.2259 10.582 13.7026C11.1106 13.1786 11.1106 12.3364 11.1106 10.6513Z"
                stroke={pathname === "/app/space/meeting/" ? "#000" : "#7B7B7B"}
                strokeWidth="0.866665"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.7782 14.2259H11.1113C12.4734 14.2259 13.1537 14.2259 13.5769 13.807C14.0001 13.388 14.0001 12.7146 14.0001 11.3662V6.36177C14.0001 5.01342 14.0001 4.33996 13.5769 3.92102C13.1537 3.50208 12.4734 3.50208 11.1113 3.50208M8.22257 7.07669V8.50654"
                stroke={pathname === "/app/space/meeting/" ? "#000" : "#7B7B7B"}
                strokeWidth="0.866665"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          name="Meeting"
          isActive={pathname === "/app/space/meeting/"}
        />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default SpaceLayout
