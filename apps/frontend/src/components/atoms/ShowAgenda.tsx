import { Switch } from "./Switch"

interface ShowAgendaProps {
  toggle: boolean
  onToggle: () => void
}

export const ShowAgenda = ({
  toggle,
  onToggle,
}: ShowAgendaProps): JSX.Element => {
  return <Switch checked={toggle} onCheckedChange={onToggle} />
}
