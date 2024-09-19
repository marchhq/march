interface Props {
  label: string
  children: React.ReactNode
}

export const UserInfo = ({ label, children }: Props): JSX.Element => {
  return (
    <div className="flex justify-between">
      <p className="text-lg font-medium">{label}</p>
      {children}
    </div>
  )
}
