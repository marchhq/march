import { GITHUB_APP_URL } from "../lib/constants/urls"

const installGitHub = (): void => {
  const appInstallationUrl = GITHUB_APP_URL
  window.location.href = appInstallationUrl
}

export default installGitHub
