'use client'

import dynamic from 'next/dynamic'

const Global = dynamic(() => import('./Global').then((module) => ({ default: module.Global })), {
  ssr: false
})

export default Global
