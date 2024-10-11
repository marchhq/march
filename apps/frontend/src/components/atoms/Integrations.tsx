import React from "react"

import { Icon } from "@iconify-icon/react"

const integrations = [
  {
    icon: "bxl:gmail",
    name: "Gmail",
    description:
      "Pull assigned issues directly to march— supports two way sync.",
    footer: "Available",
  },
  {
    icon: "ri:github-fill",
    name: "Github",
    description:
      "Pull assigned issues directly to march— supports two way sync.",
    footer: "Available",
  },
  {
    icon: "gg:linear",
    name: "Linear",
    description:
      "Pull assigned issues directly to march— supports two way sync.",
    footer: "Available",
  },
  {
    icon: "ri:notion-fill",
    name: "Notion",
    description:
      "Pull assigned issues directly to march— supports two way sync.",
    footer: "Available",
  },
  {
    icon: "uiw:message",
    name: "Text Message",
    description:
      "Pull assigned issues directly to march— supports two way sync.",
    footer: "Comming Soon",
  },
]

export const Integrations = () => {
  return (
    <div className="mx-auto max-w-4xl px-4">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration, index) => (
          <div
            key={index}
            className="hover-text hover-bg flex cursor-pointer flex-col gap-4 rounded-lg border border-transparent p-4 hover:border-border"
          >
            <div className="">
              <div className="flex items-center gap-2">
                <Icon icon={integration.icon} className="text-[18px]" />
                <h3 className="text-lg">{integration.name}</h3>
              </div>
            </div>
            <p className="text-left text-sm">{integration.description}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm">{integration.footer}</p>
              <Icon
                icon="flowbite:arrow-right-outline"
                className="text-[18px]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
