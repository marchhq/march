import React, { ReactNode } from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
}) => {
  if (!isOpen) return null

  return (
    <div>
      <div
        className="fixed inset-0 z-50 cursor-default bg-black/80"
        role="button"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape" || e.key === "Esc") {
            onClose()
          }
        }}
        tabIndex={0}
      />
      <div
        className={`fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 shadow-lg ${className}`}
      >
        {children}
      </div>
    </div>
  )
}
