"use client"
import { useTheme } from "next-themes"
import Image from "next/image"

const ThemedImage = ({
  lightSrc,
  darkSrc,
  alt,
  width,
  height,
  className,
}: {
  lightSrc: string
  darkSrc: string
  alt: string
  width: number
  height: number
  className?: string
}) => {
  const { resolvedTheme } = useTheme()
  let src

  switch (resolvedTheme) {
    case "light":
      src = lightSrc
      break
    case "dark":
      src = darkSrc
      break
    default:
      src = lightSrc
      break
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
    />
  )
}

export default ThemedImage
