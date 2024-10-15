import { Icon } from "@iconify-icon/react"

const iconsMap = {
  linear: "gg:linear",
  githubIssue: "ri:github-fill",
  githubPullRequest: "ri:git-pull-request-line",
  march: "material-symbols:circle-outline",
  marchClipper: "material-symbols:circle-outline",
  gmail: "bxl:gmail",
  sms: "mdi:sms",
  default: "material-symbols:circle-outline",
}

export const ItemIcon = ({ type }: { type: string }) => {
  const icon = iconsMap[type] || iconsMap["default"]

  return <Icon icon={icon} className="mt-1 text-[14px]" />
}
