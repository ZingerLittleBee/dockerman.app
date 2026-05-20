'use client'

import { useState } from 'react'

export function HomebrewCopyButton({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)

  const onCopy = () => {
    navigator.clipboard.writeText(command).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1400)
      },
      () => undefined
    )
  }

  return (
    <button
      className="flex w-full cursor-pointer items-center gap-2 rounded-[8px] border border-dm-line bg-dm-bg-soft px-3 py-[10px] text-left font-[var(--font-dm-mono)] text-[12px] text-dm-ink-2 transition-colors hover:border-dm-line-strong"
      onClick={onCopy}
      type="button"
    >
      <span style={{ color: 'var(--color-dm-accent-2)' }}>$</span>
      <code className="min-w-0 flex-1 overflow-hidden truncate text-dm-ink">{command}</code>
      <span
        aria-hidden="true"
        className="grid h-[22px] w-[22px] flex-shrink-0 place-items-center rounded bg-dm-bg-elev text-dm-ink-3"
      >
        {copied ? (
          <svg
            fill="none"
            height="11"
            stroke="var(--color-dm-ok)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            width="11"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            fill="none"
            height="11"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="11"
          >
            <rect height="13" rx="2" width="13" x="9" y="9" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </span>
    </button>
  )
}
