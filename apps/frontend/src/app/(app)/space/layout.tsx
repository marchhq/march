import React from "react"

interface Props {
  children: React.ReactNode
}

const SpaceLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex h-full">
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default SpaceLayout
