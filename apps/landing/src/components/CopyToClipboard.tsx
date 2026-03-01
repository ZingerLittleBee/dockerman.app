'use client'

import { RiCheckLine, RiFileCopy2Line } from '@remixicon/react'
import React from 'react'

export default function CopyToClipboard({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false)
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
    } catch (error) {
      console.error('Error copying to clipboard', error)
    } finally {
      setTimeout(() => {
        setCopied(false)
      }, 1500)
    }
  }

  return (
    <button
      className="select-none rounded border border-white/10 bg-white/20 p-1.5 backdrop-blur-xl"
      onClick={copyToClipboard}
    >
      {copied ? (
        <RiCheckLine aria-hidden="true" className="size-5 text-white" />
      ) : (
        <RiFileCopy2Line aria-hidden="true" className="size-5 text-white" />
      )}
    </button>
  )
}
