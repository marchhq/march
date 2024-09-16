import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card"
import { GithubBordered } from "@/src/lib/icons/Github"
import { Gmail } from "@/src/lib/icons/Gmail"
import { Linear } from "@/src/lib/icons/Linear"
import { Notion } from "@/src/lib/icons/Notion"

const integrations = [
  {
    icon: <Gmail />,
    name: "Gmail",
    description:
      "Label emails as march comes directly to march Inbox as action items",
    connected: true,
  },
  {
    icon: <GithubBordered />,
    name: "Github",
    description:
      "Link your GitHub account to get all your assigned issues, Pull requests In march Inbox.",
    connected: false,
  },
  {
    icon: <Linear />,
    name: "Linear",
    description:
      "Link your Linear workspace to get all your assigned issues, Action items In march Inbox. Supports two-way sync.",
    connected: false,
  },
  {
    icon: <Notion />,
    name: "Notion",
    description:
      "Link your Notion Workspace to send database items from Notion to march or import existing database items.",
    connected: false,
  },
]

export const Integrations = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {integrations.map((integration, index) => (
        <Card key={index}>
          <CardHeader className="flex items-center">
            <span className="mr-2">{integration.icon}</span>
            <CardTitle>{integration.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{integration.description}</CardDescription>
          </CardContent>
          <CardFooter>
            <p>{integration.connected ? "Connected" : "Connect"}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
