'use client'

import Link from 'next/link'
import posthog from 'posthog-js'
import { Button } from '../Button'

export default function TrackedHeroButton() {
  return (
    <Button
      className="h-10 max-w-[200px] px-8 font-semibold"
      onClick={() => {
        posthog.capture('hero_cta_clicked', {
          button_text: 'Download for free',
          location: 'hero_section'
        })
      }}
    >
      <Link href="/download">Download for free</Link>
    </Button>
  )
}
