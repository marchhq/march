interface ProfileBtnProps {
  username?: string
  fullname?: string
  email?: string
}

export const ProfileBtn = ({
  username,
  fullname,
  email,
}: ProfileBtnProps): JSX.Element => {
  const displayText = username || fullname || email || ""

  return (
    <p className="flex h-10 w-56 items-center rounded-md bg-background-active px-3 py-2 text-left text-sm shadow-md">
      {displayText}
    </p>
  )
}
