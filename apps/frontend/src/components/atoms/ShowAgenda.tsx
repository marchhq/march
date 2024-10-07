import React from 'react';
import { Switch } from "./Switch"

interface ShowAgendaProps {
  toggle: boolean
  onToggle: () => void
}

export const ShowAgenda: React.FC<ShowAgendaProps> = ({ toggle, onToggle }) => {
  return <Switch checked={toggle} onCheckedChange={onToggle} />
}
