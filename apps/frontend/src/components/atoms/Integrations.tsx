import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card"
import { ArrowRight } from "@/src/lib/icons/ArrowRight"
import { GithubDark } from "@/src/lib/icons/Github"
import { GmailDark } from "@/src/lib/icons/Gmail"
import { LinearDark } from "@/src/lib/icons/Linear"
import { NotionDark } from "@/src/lib/icons/Notion"

const integrations = [
  {
    icon: <GmailDark />,
    name: "Gmail",
    description:
      "Label emails as march comes directly to march Inbox as action items",
    footer: "Available",
  },
  {
    icon: <GithubDark />,
    name: "Github",
    description:
      "Link your GitHub account to get all your assigned issues, Pull requests In march Inbox.",
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
      "Link your Notion Workspace to send database items from Notion to march or import existing database items.",
    footer: "Available",
  },
]

export const Integrations = () => {
  return (
    <div className="flex flex-wrap gap-2">
      {integrations.map((integration, index) => (
        <Card key={index}>
          <CardHeader className="flex items-center">
            <span className="mr-2">{integration.icon}</span>
            <CardTitle>{integration.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{integration.description}</CardDescription>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p>{integration.footer}</p>
            <ArrowRight />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
