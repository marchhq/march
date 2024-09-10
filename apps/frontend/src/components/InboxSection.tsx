"use client"
import * as React from "react"

import {
  ArrowSquareOut,
  Check,
  GithubLogo,
  GitPullRequest,
  Plus,
  Tray,
  X,
} from "@phosphor-icons/react"

import { useAuth } from "../contexts/AuthContext"
import { fromNow } from "@/src/utils/datetime"
import Button from "./atoms/Button"
import useInboxStore from "../lib/store/inbox.store"
import useEditorHook from "../hooks/useEditor.hook"
import axios from "axios"
import { BACKEND_URL } from "../lib/constants/urls"
import TextEditor from "@/src/components/atoms/Editor"
import InboxIcon from "../lib/icons/InboxIcon"

interface IntegrationType {
  uuid: string
  type: "inbox" | "githubIssue" | "pullRequest" | "linearIssue"
  title: string
  description: string
  effort: string
  dueDate: string
  id: string
  url: string
  createdAt: string
  updatedAt: string
  metadata: Record<string, string>
}

const InboxSection: React.FC = () => {
  const { session } = useAuth()
  const [content, setContent] = React.useState("")
  const [integrations, setIntegrations] = React.useState<IntegrationType[]>([])
  const [isAddItem, setIsAddItem] = React.useState<boolean>(false)
  const editor = useEditorHook({ content, setContent })

  const {
    fetchInboxData,
    inboxItems,
    setInboxItems,
  } = useInboxStore()

  React.useEffect(() => {
    void fetchInboxData(session)
  }, [fetchInboxData, session, setInboxItems])

  // const renderIntegration = (integration: IntegrationType): React.ReactNode => {
  //   switch (integration.type) {
  //     case "githubIssue":
  //       return (
  //         <div className="p-1">
  //           <div className="flex items-center gap-2">
  //             <GithubLogo weight="duotone" className="text-purple-500" />
  //             <p>
  //               {integration.title}
  //               <span className="text-zinc-500">
  //                 {" "}
  //                 - {integration.metadata.org} / {integration.metadata.repo}
  //               </span>
  //             </p>
  //           </div>
  //           <div className="ml-5 text-xs text-zinc-500">
  //             #{integration.metadata.number}, opened{" "}
  //             {fromNow(integration.createdAt)}
  //           </div>
  //         </div>
  //       )
  //     case "pullRequest":
  //       return (
  //         <div className="p-1">
  //           <div className="flex items-center gap-2">
  //             <GitPullRequest weight="duotone" className="text-purple-500" />
  //             <p>{integration.title}</p>
  //           </div>
  //           <div className="ml-5 text-xs text-zinc-500">
  //             #{integration.metadata.number}, opened{" "}
  //             {fromNow(integration.createdAt)}
  //           </div>
  //         </div>
  //       )
  //     case "linearIssue":
  //     default:
  //       return (
  //         <div className="p-1">
  //           <div className="flex items-center gap-2">
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               fill="none"
  //               width="12"
  //               height="12"
  //               viewBox="0 0 100 100"
  //             >
  //               <path
  //                 fill="#fff"
  //                 d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L39.3342 97.1782c.6889.6889.0915 1.8189-.857 1.5964C20.0515 94.4522 5.54779 79.9485 1.22541 61.5228ZM.00189135 46.8891c-.01764375.2833.08887215.5599.28957165.7606L52.3503 99.7085c.2007.2007.4773.3075.7606.2896 2.3692-.1476 4.6938-.46 6.9624-.9259.7645-.157 1.0301-1.0963.4782-1.6481L2.57595 39.4485c-.55186-.5519-1.49117-.2863-1.648174.4782-.465915 2.2686-.77832 4.5932-.92588465 6.9624ZM4.21093 29.7054c-.16649.3738-.08169.8106.20765 1.1l64.77602 64.776c.2894.2894.7262.3742 1.1.2077 1.7861-.7956 3.5171-1.6927 5.1855-2.684.5521-.328.6373-1.0867.1832-1.5407L8.43566 24.3367c-.45409-.4541-1.21271-.3689-1.54074.1832-.99132 1.6684-1.88843 3.3994-2.68399 5.1855ZM12.6587 18.074c-.3701-.3701-.393-.9637-.0443-1.3541C21.7795 6.45931 35.1114 0 49.9519 0 77.5927 0 100 22.4073 100 50.0481c0 14.8405-6.4593 28.1724-16.7199 37.3375-.3903.3487-.984.3258-1.3542-.0443L12.6587 18.074Z"
  //               />
  //             </svg>
  //             <p>{integration.title}</p>
  //           </div>
  //           <div className="ml-5 text-xs text-zinc-500">
  //             Opened {fromNow(integration.createdAt)}
  //           </div>
  //         </div>
  //       )
  //   }
  // }

  const addItemToInbox = async () => {
    if (!session) {
      console.error("User is not authenticated")
      return
    }

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/items/create`,
        {
          description: content,
        },
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )

      if (res.status === 200) {
        console.log("Item successfully added to the inbox:")
        void fetchInboxData(session)
        setContent("")
        setIsAddItem(false)
      }
    } catch (error) {
      console.error("Error adding item to inbox:", error)
    }
  }

  return (
    <section>
      {/* <div className="my-10 space-y-1 text-sm text-zinc-300">
        {integrations.map((integration, index) => (
          <div
            key={index}
            className="flex items-center rounded-md border border-white/min bg-white/min px-1.5 py-1 shadow-md backdrop-blur-lg"
          >
            {renderIntegration(integration)}
            <a
              target="_blank"
              href={integration.url}
              className="ml-auto rounded-md p-1.5 transition-all hover:bg-zinc-900"
            >
              <ArrowSquareOut />
            </a>
          </div>
        ))}
      </div> */}

      <h1 className=" text-4xl font-semibold text-black dark:text-zinc-300 flex items-center gap-4 mb-4">
        <InboxIcon/> Inbox
      </h1>
      {isAddItem ? (
        <div className="flex gap-4 items-center flex-wrap my-6">
          <Button
            onClick={() => {
              setIsAddItem(false)
              setContent("")
            }}
            variant={"invisible"}
            className="flex gap-2 py-2 items-center text-gray-500 dark:text-zinc-300 hover:text-white"
          >
            <X size={20} />
            <p className="text-medium ">Cancel</p>
          </Button>
          <Button
            variant={"primary"}
            onClick={addItemToInbox}
            className="flex items-center py-2 gap-2"
          >
            <Check size={20} />
            <p className="text-medium ">Save</p>
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setIsAddItem(true)}
          variant={"invisible"}
          className="flex gap-4 items-center py-2 my-6 text-gray-500 dark:text-zinc-300 hover:text-white"
        >
          <Plus size={21} />
          <h1 className="text-lg ">Click to add an item</h1>
        </Button>
      )}
      {isAddItem && editor && (
        <div>
          <div className="h-full bg-white dark:bg-zinc-700 rounded-xl mb-6 p-4 text-black dark:text-white">
            <TextEditor placeholder="Enter Details Here" editor={editor} />
          </div>
        </div>
      )}

      {/* Inbox items section */}
      <div>
        {inboxItems.length === 0 ? (
          <div className="text-gray-500 dark:text-zinc-300">
            Inbox seems empty!
          </div>
        ) : (
          inboxItems?.map((item) => (
            <div
              key={item.uuid}
              className="text-gray-500 dark:text-zinc-300 p-4 rounded-xl bg-white dark:bg-zinc-700 my-2 cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-100 dark:hover:bg-white/5"
            >
              {/* Apply the `rendered-content` class to style HTML content */}
              <div className="rendered-content">
                <p
                  dangerouslySetInnerHTML={{ __html: item.description || "" }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default InboxSection
