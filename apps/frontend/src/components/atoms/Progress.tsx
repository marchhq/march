"use client"
import { usePathname } from "next/navigation"

const normalizePath = (path: string): string => path.replace(/\/$/, "")

const paths = [
  {
    route: "/",
  },
  {
    route: "/calendar",
  },
  {
    route: "/stack",
  },
  {
    route: "/timezone",
  },
]

export const ProgressBar = (): JSX.Element => {
  const pathname = normalizePath(usePathname())
  const currentPath = paths.findIndex((path) => path.route === pathname) + 1

  return (
    <div className="flex justify-center space-x-4">
      {paths.map((path, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full ${
            currentPath === index + 1 ? "bg-gray-600" : "bg-gray-300"
          }`}
        ></div>
      ))}
    </div>
  )
}
