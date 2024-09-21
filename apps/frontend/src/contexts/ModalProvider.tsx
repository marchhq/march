"use client"
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react"

import FeedbackModal from "../components/FeedbackModal/FeedbackModal"
import { Dialog, DialogContent } from "../components/ui/dialog"

interface ModalContextType {
  showModal: (content: ReactNode) => void
  hideModal: () => void
}

const defaultModalContextValue: ModalContextType = {
  showModal: () => {},
  hideModal: () => {},
}

const ModalContext = createContext<ModalContextType>(defaultModalContextValue)

const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [modalContent, setModalContent] = useState<ReactNode>(null)

  const showModal = (content: ReactNode) => {
    setModalContent(content)
    setIsModalVisible(true)
  }

  const hideModal = () => setIsModalVisible(false)

  // Load specific modals on keypress
  const handleKeyPress = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "f") {
      event.preventDefault()
      showModal(<FeedbackModal />)
    }
  }

  useEffect(() => {
    console.log("Keypress listener activated")
    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [])

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Dialog open={isModalVisible} onOpenChange={setIsModalVisible}>
        <DialogContent>{modalContent}</DialogContent>
      </Dialog>
    </ModalContext.Provider>
  )
}

// Custom hook to access the modal context
export const useModal = () => useContext(ModalContext)

export default ModalProvider
