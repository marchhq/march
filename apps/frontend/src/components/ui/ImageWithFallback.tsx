import React, { useState } from "react"

import { LucideIcon } from "lucide-react"
import Image from "next/image"

interface ImageWithFallbackProps {
  src: string
  fallbackSrc?: string
  FallbackIcon?: LucideIcon
  alt: string
  width: number
  height: number
  className?: string
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = (props) => {
  const { src, fallbackSrc, FallbackIcon, alt, ...rest } = props
  const [imgSrc, setImgSrc] = useState(src)
  const [imgError, setImgError] = useState(false)

  return imgError && FallbackIcon ? (
    <FallbackIcon {...rest} />
  ) : (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (fallbackSrc) {
          setImgSrc(fallbackSrc)
        } else {
          setImgError(true)
        }
      }}
    />
  )
}

export default ImageWithFallback
