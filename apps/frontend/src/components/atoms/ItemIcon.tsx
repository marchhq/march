import { Icon } from "@iconify-icon/react"

const iconsMap = {
  linear: "gg:linear",
  githubIssue: "ri:github-fill",
  githubPullRequest: "ri:git-pull-request-line",
  march: "fluent:note-16-regular",
  marchClipper: "material-symbols:circle-outline",
  gmail: "bxl:gmail",
  sms: "mdi:sms",
  default: "fluent:note-16-regular",
}

export const ItemIcon = ({ type }: { type: string }) => {
  const icon = iconsMap[type] || iconsMap["default"]

  return <Icon icon={icon} className="mt-0.5 text-[18px]" />
}
