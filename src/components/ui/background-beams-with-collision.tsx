'use client'
import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export const BackgroundBeamsWithCollision = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const parentRef = useRef<HTMLDivElement>(null)

  const beams = [
    {
      initialX: 10,
      translateX: 10,
      duration: 7,
      repeatDelay: 3,
      delay: 2
    },
    {
      initialX: 600,
      translateX: 600,
      duration: 3,
      repeatDelay: 3,
      delay: 4
    },
    {
      initialX: 100,
      translateX: 100,
      duration: 7,
      repeatDelay: 7,
      className: 'h-6'
    },
    {
      initialX: 400,
      translateX: 400,
      duration: 5,
      repeatDelay: 14,
      delay: 4
    },
    {
      initialX: 800,
      translateX: 800,
      duration: 11,
      repeatDelay: 2,
      className: 'h-20'
    },
    {
      initialX: 1000,
      translateX: 1000,
      duration: 4,
      repeatDelay: 2,
      className: 'h-12'
    },
    {
      initialX: 1200,
      translateX: 1200,
      duration: 6,
      repeatDelay: 4,
      delay: 2,
      className: 'h-6'
    }
  ]

  return (
    <div
      className={cn(
        'relative flex h-96 w-full items-center justify-center overflow-hidden bg-gradient-to-b from-white to-neutral-100 md:h-[40rem] dark:from-[#060912] dark:to-neutral-900',
        // h-screen if you want bigger
        className
      )}
      ref={parentRef}
    >
      {beams.map((beam) => (
        <CollisionMechanism
          beamOptions={beam}
          containerRef={containerRef}
          key={beam.initialX + 'beam-idx'}
          parentRef={parentRef}
        />
      ))}

      {children}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full bg-neutral-100"
        ref={containerRef}
        style={{
          boxShadow:
            '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset'
        }}
      />
    </div>
  )
}

const CollisionMechanism = React.forwardRef<
  HTMLDivElement,
  {
    containerRef: React.RefObject<HTMLDivElement | null>
    parentRef: React.RefObject<HTMLDivElement | null>
    beamOptions?: {
      initialX?: number
      translateX?: number
      initialY?: number
      translateY?: number
      rotate?: number
      className?: string
      duration?: number
      delay?: number
      repeatDelay?: number
    }
  }
>(({ parentRef, containerRef, beamOptions = {} }, _) => {
  const beamRef = useRef<HTMLDivElement>(null)
  const [collision, setCollision] = useState<{
    detected: boolean
    coordinates: { x: number; y: number } | null
  }>({
    detected: false,
    coordinates: null
  })
  const [beamKey, setBeamKey] = useState(0)
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false)

  useEffect(() => {
    const checkCollision = () => {
      if (beamRef.current && containerRef.current && parentRef.current && !cycleCollisionDetected) {
        const beamRect = beamRef.current.getBoundingClientRect()
        const containerRect = containerRef.current.getBoundingClientRect()
        const parentRect = parentRef.current.getBoundingClientRect()

        if (beamRect.bottom >= containerRect.top) {
          const relativeX = beamRect.left - parentRect.left + beamRect.width / 2
          const relativeY = beamRect.bottom - parentRect.top

          setCollision({
            detected: true,
            coordinates: {
              x: relativeX,
              y: relativeY
            }
          })
          setCycleCollisionDetected(true)
        }
      }
    }

    const animationInterval = setInterval(checkCollision, 50)

    return () => clearInterval(animationInterval)
  }, [cycleCollisionDetected, containerRef])

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      setTimeout(() => {
        setCollision({ detected: false, coordinates: null })
        setCycleCollisionDetected(false)
      }, 2000)

      setTimeout(() => {
        setBeamKey((prevKey) => prevKey + 1)
      }, 2000)
    }
  }, [collision])

  return (
    <>
      <motion.div
        animate="animate"
        className={cn(
          'absolute top-20 left-0 m-auto h-14 w-px rounded-full bg-gradient-to-t from-indigo-500 via-purple-500 to-transparent',
          beamOptions.className
        )}
        initial={{
          translateY: beamOptions.initialY || '-200px',
          translateX: beamOptions.initialX || '0px',
          rotate: beamOptions.rotate || 0
        }}
        key={beamKey}
        ref={beamRef}
        transition={{
          duration: beamOptions.duration || 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'loop',
          ease: 'linear',
          delay: beamOptions.delay || 0,
          repeatDelay: beamOptions.repeatDelay || 0
        }}
        variants={{
          animate: {
            translateY: beamOptions.translateY || '1800px',
            translateX: beamOptions.translateX || '0px',
            rotate: beamOptions.rotate || 0
          }
        }}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            className=""
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            style={{
              left: `${collision.coordinates.x}px`,
              top: `${collision.coordinates.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
})

CollisionMechanism.displayName = 'CollisionMechanism'

const Explosion = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10)
  }))

  return (
    <div {...props} className={cn('absolute z-50 h-2 w-2', props.className)}>
      <motion.div
        animate={{ opacity: 1 }}
        className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
      {spans.map((span) => (
        <motion.span
          animate={{
            x: span.directionX,
            y: span.directionY,
            opacity: 0
          }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500"
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          key={span.id}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
