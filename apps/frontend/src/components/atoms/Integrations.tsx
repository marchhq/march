import React from "react"

import { ArrowRight } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card"
import { GithubDark } from "@/src/lib/icons/Github"
import { GmailDark } from "@/src/lib/icons/Gmail"
import { LinearDark } from "@/src/lib/icons/Linear"
import { NotionDark } from "@/src/lib/icons/Notion"
import { TextMessage } from "@/src/lib/icons/TextMessage"

const integrations = [
  {
    icon: <GmailDark />,
    name: "Gmail",
    description:
      "Pull assigned issues directly to march— supports two way sync.",
    footer: "Available",
  },
  {
    icon: <GithubDark />,
    name: "Github",
    description:
      "Pull assigned issues directly to march— supports two way sync.",
    footer: "Available",
  },
  {
    icon: <LinearDark />,
    name: "Linear",
    description:
      "Pull assigned issues directly to march— supports two way sync.",
    footer: "Available",
  },
  {
    icon: <NotionDark />,
    name: "Notion",
    description:
      "Pull assigned issues directly to march— supports two way sync.",
    footer: "Available",
  },
  {
    icon: <TextMessage />,
    name: "Text Message",
    description:
      "Pull assigned issues directly to march— supports two way sync.",
    footer: "Comming Soon",
  },
]

export const Integrations = () => {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration, index) => (
          <Card
            key={index}
            className="flex cursor-pointer flex-col hover:text-gray-100"
          >
            <CardHeader className="shrink-0 p-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{integration.icon}</span>
                <CardTitle className="text-lg">{integration.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grow p-4">
              <CardDescription className="text-left text-sm">
                {integration.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex shrink-0 items-center justify-between p-4">
              <p className="text-sm">{integration.footer}</p>
              <ArrowRight className="size-4" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
