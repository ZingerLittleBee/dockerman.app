'use client'

import dynamic from 'next/dynamic'

const CtaSection = dynamic(() => import('./CtaSection'), { ssr: false })

export default CtaSection
