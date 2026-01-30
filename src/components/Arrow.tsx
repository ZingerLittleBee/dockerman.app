import type { SVGProps } from 'react'

export default function Arrow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      height={props.height}
      preserveAspectRatio="none"
      viewBox="0 0 30 10"
      width={props.width}
      {...props}
    >
      <polygon points="0,0 30,0 15,10" />
    </svg>
  )
}
