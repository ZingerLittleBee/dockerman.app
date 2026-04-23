interface SparklineProps {
  data: number[]
  stroke: string
  fill?: string
  width?: number
  height?: number
  strokeWidth?: number
}

export function Sparkline({
  data,
  stroke,
  fill,
  width = 120,
  height = 32,
  strokeWidth = 1.5,
}: SparklineProps) {
  if (data.length < 2) {
    return <svg aria-hidden height={height} width={width} />
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - strokeWidth * 2) - strokeWidth
    return [x, y] as const
  })

  const linePath = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(' ')
  const fillPath = fill ? `${linePath} L${width},${height} L0,${height} Z` : null

  return (
    <svg aria-hidden height={height} viewBox={`0 0 ${width} ${height}`} width={width}>
      {fillPath && <path d={fillPath} fill={fill} stroke="none" />}
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}
