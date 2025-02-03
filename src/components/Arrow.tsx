import type { SVGProps } from "react"

export default function Arrow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 30 10"
      preserveAspectRatio="none"
      aria-hidden="true"
      {...props}
    >
      <polygon points="0,0 30,0 15,10" />
    </svg>
  )
}
