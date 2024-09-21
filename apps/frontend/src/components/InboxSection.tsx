"use client"
import * as React from "react"

// import {
//   ArrowSquareOut,
//   GithubLogo,
//   GitPullRequest,
// } from "@phosphor-icons/react"

import { useAuth } from "../contexts/AuthContext"
// import Editor from "@/src/components/atoms/Editor"
// import { fromNow } from "@/src/utils/datetime"

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
  metadata: Array<Record<string, string>>
}

const InboxSection: React.FC = () => {
  const { session } = useAuth()
  const [content, setContent] = React.useState("Start by editing this text...")
  const [integrations, setIntegrations] = React.useState<IntegrationType[]>([])

  const fetchData = async (): Promise<void> => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      }
      console.log("HEY")
      const res = await fetch("http://localhost:8080/api/my", config)
      const data = await res.json()
      console.log(data)
      setIntegrations(data.IntegratedAppIssues as IntegrationType[])
    } catch (err) {
      console.log(err)
    }
  }

  React.useEffect(() => {
    fetchData()
  })

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

  return (
    <section>
      {/* <Editor content={content} setContent={setContent} />
      <div className="my-10 space-y-1 text-sm text-zinc-300">
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
    </section>
  )
}

export default InboxSection
