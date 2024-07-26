import * as React from "react"

import classNames from "@/utils/classNames"

interface Props {
  children?: React.ReactNode
  className?: string
}

const Container: React.FC<Props> = ({ children, className }) => {
  return (
    <div className={classNames("mx-auto max-w-[680px]", className)}>
      {children}
    </div>
  )
}

export default Container
