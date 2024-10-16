import { Loader, Loader2 } from "lucide-react"

interface SpinnerProps {
  color?: string
  size?: number
}

const Spinner: React.FC<SpinnerProps> = ({
  color = "text-gray-500",
  size = 20,
}) => {
  return <Loader2 className={`3s animate-spin ${color} size-${size}`} />
}

export default Spinner
