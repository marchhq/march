"use client"
import * as React from "react"

import { useAuth } from "@clerk/nextjs"
import {
  ArrowSquareOut,
  GithubLogo,
  GitPullRequest,
} from "@phosphor-icons/react"

import Editor from "@/components/atoms/Editor"
import { fromNow } from "@/utils/datetime"

interface IntegrationType {
  type: "inbox" | "githubIssue" | "pullRequest" | "linearIssue"
  title: string
  url: string
  created_at: string
  updated_at: string
  meta: Array<Record<string, string>>
}

const InboxSection: React.FC = () => {
  const { getToken } = useAuth()
  const [content, setContent] = React.useState("Start by editing this text...")
  const [integrations, setIntegrations] = React.useState<IntegrationType[]>([])

  const fetchData = async (): Promise<void> => {
    try {
      const token = await getToken()
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const res = await fetch("http://localhost:8080/github/issues/", config)
      const data = await res.json()
      setIntegrations([
        ...data.issues.map((issue) => ({ ...issue, type: "githubIssue" })),
        ...data.pullRequests.map((pullRequest) => ({
          ...pullRequest,
          type: "pullRequest",
        })),
      ])
    } catch (err) {
      console.log(err)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  const renderIntegration = (integration: IntegrationType): React.ReactNode => {
    switch (integration.type) {
      case "githubIssue":
        return (
          <div className="flex items-center rounded-md border border-white/5 bg-white/min p-1.5 shadow-lg backdrop-blur-lg">
            <div className="p-1.5">
              <div className="flex items-center gap-2">
                <GithubLogo weight="duotone" className="text-purple-500" />
                <p>{integration.title}</p>
              </div>
              <div className="ml-5 text-xs text-zinc-500">
                #{integration.number}, opened {fromNow(integration.created_at)}
              </div>
            </div>
            <a
              target="_blank"
              href={integration.url}
              className="ml-auto rounded-md p-1.5 transition-all hover:bg-zinc-900"
            >
              <ArrowSquareOut />
            </a>
          </div>
        )
      case "pullRequest":
        return (
          <div className="flex items-center rounded-md border border-white/5 bg-white/min p-1.5 shadow-lg backdrop-blur-lg">
            <div className="p-1.5">
              <div className="flex items-center gap-2">
                <GitPullRequest weight="duotone" className="text-purple-500" />
                <p>{integration.title}</p>
              </div>
              <div className="ml-5 text-xs text-zinc-500">
                #{integration.number}, opened {fromNow(integration.created_at)}
              </div>
            </div>
            <a
              target="_blank"
              href={integration.url}
              className="ml-auto rounded-md p-1.5 transition-all hover:bg-zinc-900"
            >
              <ArrowSquareOut />
            </a>
          </div>
        )
    }
  }

  return (
    <section>
      <Editor content={content} setContent={setContent} />
      <div className="my-10 space-y-1 text-sm text-zinc-300">
        {integrations.map(renderIntegration)}
      </div>
    </section>
  )
}

export default InboxSection
