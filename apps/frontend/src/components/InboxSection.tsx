"use client"
import * as React from "react"

import { Check, Clock, Plus, X } from "@phosphor-icons/react"
import axios from "axios"

import { RescheduleCalendar } from "./RescheduleCalendar/RescheduleCalendar"
import { useAuth } from "../contexts/AuthContext"
import useEditorHook from "../hooks/useEditor.hook"
import { useToast } from "../hooks/useToast"
import { BACKEND_URL } from "../lib/constants/urls"
import InboxIcon from "../lib/icons/InboxIcon"
import useInboxStore from "../lib/store/inbox.store"
import TextEditor from "@/src/components/atoms/Editor"
import { Popover, PopoverContent, PopoverTrigger } from "./atoms/Popover"
import useSpaceStore from "../lib/store/space.inbox"
import { Page } from "../lib/@types/Items/space"
import Button from "./atoms/Button"
import InboxActions from "./InboxActions"

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
  const [isSaved, setIsSaved] = React.useState(false)
  const [isAddItem, setIsAddItem] = React.useState<boolean>(false)
  const [selectedItemId, setSelectedItemId] = React.useState<string>("")
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const editor = useEditorHook({ content, setContent, setIsSaved })
  const { toast } = useToast()

  const { fetchInboxData, inboxItems, setInboxItems, moveItemToDate } =
    useInboxStore()
  const { pages, fetchPages, createPage } = useSpaceStore()

  const config = {
    headers: {
      Authorization: `Bearer ${session}`,
    },
  }

  React.useEffect(() => {
    void fetchInboxData(session)
  }, [fetchInboxData, session, setInboxItems])

  React.useEffect(() => {
    const updateDate = async () => {
      if (selectedItemId) {
        const result = await moveItemToDate(session, selectedItemId, date)
        if (result) {
          toast({
            title: "Updated successfully!",
          })
        }
      }
    }

    updateDate()
  }, [date])

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
        config
      )

      if (res.status === 200) {
        void fetchInboxData(session)
        setContent("")
        setIsAddItem(false)
        toast({
          title: "Item added successfully!",
        })
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

      <h1 className=" mb-4 flex items-center gap-4 text-4xl font-semibold text-black dark:text-zinc-300">
        <InboxIcon /> Inbox
      </h1>
      {isAddItem ? (
        <div className="my-6 flex flex-wrap items-center gap-4">
          <Button
            onClick={() => {
              setIsAddItem(false)
              setContent("")
            }}
            variant={"invisible"}
            className="flex items-center gap-2 py-2 text-zinc-700 hover:text-white dark:text-zinc-300"
          >
            <X size={20} />
            <p className="text-base ">Cancel</p>
          </Button>
          <Button
            variant={"primary"}
            onClick={addItemToInbox}
            className="flex items-center gap-2 py-2"
          >
            <Check size={20} />
            <p className="text-base ">Save</p>
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setIsAddItem(true)}
          variant={"invisible"}
          className="my-6 flex items-center gap-4 py-2 text-zinc-700 hover:text-white dark:text-zinc-300 "
        >
          <Plus size={21} />
          <h1 className="text-lg">Click to add an item</h1>
        </Button>
      )}
      {isAddItem && editor && (
        <div>
          <div className="mb-6 h-full rounded-xl border bg-white p-4 focus-within:border-black dark:border-black dark:bg-zinc-700 dark:text-white dark:focus-within:border-gray-400">
            <TextEditor placeholder="Enter Details Here" editor={editor} />
          </div>
        </div>
      )}

      {/* Inbox items section */}
      <div>
        {inboxItems.length === 0 ? (
          <div className="my-6 flex size-full items-center justify-center text-gray-500 dark:text-zinc-300">
            Inbox seems empty!
          </div>
        ) : (
          inboxItems?.map((item) => (
            <div
              key={item.uuid}
              className="group my-2 flex cursor-pointer items-center justify-between rounded-xl bg-white p-4 text-gray-500 hover:bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500 dark:bg-background dark:text-zinc-300 dark:hover:border dark:hover:border-border"
              tabIndex={0} // This is needed to allow the div to be focusable
            >
              <div className="rendered-content">
                <p
                  dangerouslySetInnerHTML={{ __html: item.description || "" }}
                />
              </div>
              <div className="flex items-center gap-2">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    item._id && setSelectedItemId(item._id)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      item._id && setSelectedItemId(item._id)
                    }
                  }}
                  className="invisible group-hover:visible focus-within:visible "
                >
                  <RescheduleCalendar
                    date={item.dueDate ? new Date(item.dueDate) : undefined}
                    setDate={setDate}
                    icon={<Clock size={20} />}
                  />
                </div>
                <div className="invisible group-hover:visible focus-within:visible ">
                  <InboxActions pages={pages} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}



export default InboxSection
