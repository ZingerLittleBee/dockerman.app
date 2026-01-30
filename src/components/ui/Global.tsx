'use client'
import createGlobe, { type Marker } from 'cobe'
import { type FunctionComponent, useCallback, useEffect, useRef } from 'react'

const GLOBE_CONFIG = {
  dark: 1,
  diffuse: 1.2,
  mapSamples: 16_000,
  mapBrightness: 13,
  mapBaseBrightness: 0.05,
  baseColor: [0.3, 0.3, 0.3] as [number, number, number],
  glowColor: [0.15, 0.15, 0.15] as [number, number, number],
  markerColor: [100, 100, 100] as [number, number, number],
  markers: [] as Marker[],
  theta: -0.3
}

const CANVAS_SIZE = 800

export const Global: FunctionComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(4.7)
  const isVisibleRef = useRef(true)

  const onRender = useCallback((state: { phi?: number }) => {
    // 只在可见时更新动画
    if (isVisibleRef.current) {
      state.phi = phiRef.current
      phiRef.current += 0.0003
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // 获取实际的 devicePixelRatio，但限制最大值避免过度渲染
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const size = CANVAS_SIZE * dpr

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: size,
      height: size,
      phi: 0,
      ...GLOBE_CONFIG,
      onRender
    })

    // 不可见时暂停渲染
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0]?.isIntersecting ?? true
      },
      { threshold: 0.1 }
    )

    observer.observe(canvas)

    return () => {
      globe.destroy()
      observer.disconnect()
    }
  }, [onRender])

  const features = [
    {
      name: 'Powerful Performance',
      description: 'Built with Tauri and Rust for lightning-fast powerful desktop experience.'
    },
    {
      name: 'Real-time Monitoring',
      description: 'Monitor container stats, logs, and resource usage in real-time.'
    },
    {
      name: 'Container Management',
      description: 'Easily manage containers with detailed inspection and terminal access.'
    }
  ]

  return (
    <div className="px-3">
      <section
        aria-labelledby="global-title"
        className="relative mx-auto mt-28 flex w-full max-w-6xl flex-col items-center justify-center overflow-hidden rounded-3xl bg-gray-950 pt-24 shadow-black/30 shadow-xl md:mt-40"
      >
        <div className="absolute top-[17rem] size-[40rem] rounded-full bg-indigo-800 blur-3xl md:top-[20rem]" />
        <div className="z-10 inline-block rounded-lg border border-indigo-400/20 bg-indigo-800/20 px-3 py-1.5 font-semibold uppercase leading-4 tracking-tight sm:text-sm">
          <span className="bg-gradient-to-b from-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            Modern Docker Management
          </span>
        </div>
        <h2
          className="z-10 mt-6 inline-block bg-gradient-to-b from-white to-indigo-100 bg-clip-text px-2 text-center font-bold text-5xl text-transparent tracking-tighter md:text-8xl"
          id="global-title"
        >
          <p className="hidden md:block">
            Lightweight <br /> Docker Management
          </p>
          <p className="block md:hidden">Powerful Lightweight</p>
        </h2>
        <canvas
          className="absolute top-[7.1rem] z-20 aspect-square size-full max-w-fit md:top-[12rem]"
          ref={canvasRef}
          style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
        />
        <div className="z-20 -mt-32 h-[36rem] w-full overflow-hidden md:-mt-36">
          <div className="absolute bottom-0 h-3/5 w-full rounded-3xl bg-gradient-to-b from-transparent via-gray-950/95 to-gray-950" />
          <div className="absolute inset-x-6 bottom-12 m-auto max-w-4xl md:top-2/3">
            <div className="grid grid-cols-1 gap-x-10 gap-y-6 rounded-lg border border-white/[3%] bg-white/[1%] px-6 py-6 shadow-xl backdrop-blur md:grid-cols-3 md:p-8">
              {features.map((item) => (
                <div className="flex flex-col gap-2" key={item.name}>
                  <h3 className="whitespace-nowrap bg-gradient-to-b from-indigo-300 to-indigo-500 bg-clip-text font-semibold text-lg text-transparent md:text-xl">
                    {item.name}
                  </h3>
                  <p className="text-indigo-200/40 text-sm leading-6">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
