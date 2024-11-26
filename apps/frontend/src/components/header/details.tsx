import React from "react"

interface DetailsProps {
  children: React.ReactNode
  className?: string
}

const Details: React.FC<DetailsProps> = ({ children, className }) => {
  return (
    <div className={`flex items-center gap-1 text-sm ${className || ""}`}>
      {children}
    </div>
  )
}

export default Details
