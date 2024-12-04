import { Icon } from '@iconify/react'
import { Button } from '../buttons/button'
import { useGitHubLogin } from '@renderer/hooks/use-github-login'

export const GithubLogin = (): JSX.Element => {
  const { handleLogin } = useGitHubLogin()

  return (
    <Button onClick={handleLogin}>
      <Icon icon="ri:github-fill" className="text-[14px]" />
      <span className="pr-1">Continue with Github</span>
    </Button>
  )
}
