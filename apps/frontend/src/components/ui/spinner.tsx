import { Loader, Loader2 } from "lucide-react"

interface SpinnerProps {
  color?: string  
  size?: number  
}

  

const Spinner: React.FC<SpinnerProps> = ({ color = "text-gray-500", size = 20 }) => {
    
  return (
    <Loader2 className={`animate-spin 3s ${color} size-${size}`} />
  )
}

export default Spinner
