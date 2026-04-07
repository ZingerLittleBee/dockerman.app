'use client'

import dynamic from 'next/dynamic'

const Faqs = dynamic(() => import('./Faqs').then((module) => ({ default: module.Faqs })))

export default Faqs
