'use client'
import Image from 'next/image'
import { useTheme } from 'next-themes'

const ThemedImage = ({
  lightSrc,
  darkSrc,
  alt,
  width,
  height,
  className
}: {
  lightSrc: string
  darkSrc: string
  alt: string
  width: number
  height: number
  className?: string
}) => {
  const { resolvedTheme } = useTheme()
  let src: string

  switch (resolvedTheme) {
    case 'light':
      src = lightSrc
      break
    case 'dark':
      src = darkSrc
      break
    default:
      src = lightSrc
      break
  }

  return <Image alt={alt} className={className} height={height} priority src={src} width={width} />
}

export default ThemedImage
