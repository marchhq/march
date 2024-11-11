type Props = {
  className?: string
}

export const LeftChevron = ({ className }: Props): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={`${className} fill-current`}
    >
      <path d="M14.47 18.53a.75.75 0 0 0 1.06 0V5.47a.75.75 0 0 0-1.06 0l-6 6a.75.75 0 0 0 0 1.06z" />
    </svg>
  )
}

export const RightChevron = ({ className }: Props): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={`${className} fill-current`}
    >
      <path d="M9.53 5.47a.75.75 0 0 0-1.06 0v13.06a.75.75 0 0 0 1.06 0l6-6a.75.75 0 0 0 0-1.06z" />
    </svg>
  )
}

export const RightChevron2 = (): JSX.Element => {
  return (
    <svg
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.04551 5.20455C7.48484 5.64389 7.48483 6.35619 7.0455 6.79553L2.58065 11.2604C2.25893 11.5821 1.77508 11.6784 1.35471 11.5043C0.934345 11.3302 0.660223 10.92 0.660156 10.465L0.658849 1.53389C0.658782 1.07884 0.932859 0.668556 1.35326 0.494388C1.77367 0.320219 2.25759 0.416466 2.57936 0.738243L7.04551 5.20455Z"
        fill="white"
        fillOpacity="0.5"
      />
    </svg>
  )
}
