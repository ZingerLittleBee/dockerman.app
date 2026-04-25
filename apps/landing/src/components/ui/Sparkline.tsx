interface SparklineProps {
  data: number[]
  stroke: string
  fill?: string
  width?: number
  height?: number
  strokeWidth?: number
  className?: string
  animate?: boolean
}

const PATH_TRANSITION = {
  transition: 'd 1200ms cubic-bezier(0.22, 1, 0.36, 1)'
} as const

type Point = readonly [number, number]

// Catmull-Rom → cubic Bézier with a tension factor. Produces a C1-continuous
// curve passing through every point, smoother than straight segments but
// without the overshoot of a looser spline.
function buildSmoothPath(points: readonly Point[]): string {
  if (points.length === 0) {
    return ''
  }
  const [firstX, firstY] = points[0] as Point
  if (points.length === 1) {
    return `M${firstX.toFixed(2)},${firstY.toFixed(2)}`
  }

  const tension = 6
  let d = `M${firstX.toFixed(2)},${firstY.toFixed(2)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = (points[i - 1] ?? points[i]) as Point
    const p1 = points[i] as Point
    const p2 = points[i + 1] as Point
    const p3 = (points[i + 2] ?? p2) as Point

    const c1x = p1[0] + (p2[0] - p0[0]) / tension
    const c1y = p1[1] + (p2[1] - p0[1]) / tension
    const c2x = p2[0] - (p3[0] - p1[0]) / tension
    const c2y = p2[1] - (p3[1] - p1[1]) / tension

    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`
  }
  return d
}

export function Sparkline({
  data,
  stroke,
  fill,
  width = 120,
  height = 32,
  strokeWidth = 1.5,
  className,
  animate = true
}: SparklineProps) {
  const sizeProps = className ? {} : { width, height }
  if (data.length < 2) {
    return <svg aria-hidden className={className} {...sizeProps} />
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - strokeWidth * 2) - strokeWidth
    return [x, y] as const
  })

  const linePath = buildSmoothPath(points)
  const fillPath = fill ? `${linePath} L${width},${height} L0,${height} Z` : null
  const pathStyle = animate ? PATH_TRANSITION : undefined

  return (
    <svg
      aria-hidden
      className={className}
      preserveAspectRatio={className ? 'none' : undefined}
      viewBox={`0 0 ${width} ${height}`}
      {...sizeProps}
    >
      {fillPath && <path d={fillPath} fill={fill} stroke="none" style={pathStyle} />}
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        style={pathStyle}
        vectorEffect={className ? 'non-scaling-stroke' : undefined}
      />
    </svg>
  )
}
