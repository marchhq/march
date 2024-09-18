import React from "react"

import SecondSidebar from "@/src/components/SecondSidebar"

interface Props {
  children: React.ReactNode
}

const SpaceLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-full flex">
      <SecondSidebar />
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default SpaceLayout
