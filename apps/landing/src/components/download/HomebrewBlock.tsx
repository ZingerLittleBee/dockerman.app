'use client'

import { useState } from 'react'
import { downloadsConfig } from '@/config/downloads'

export function HomebrewBlock() {
  const [copied, setCopied] = useState(false)
  const cmd = downloadsConfig.homebrewCommand

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(cmd)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      // ignore
    }
  }

  return (
    <section className="px-8">
      <div className="mx-auto max-w-[1140px]">
        <div className="grid">
          <div className="mx-auto w-full max-w-[620px] flex flex-col gap-[10px] rounded-[12px] border border-dm-line bg-dm-bg-elev p-[16px_18px]">
            <div className="flex items-center gap-[10px]">
              <div
                className="grid h-7 w-7 place-items-center rounded-[7px] border border-dm-line bg-dm-bg-soft text-dm-ink-2"
              >
                <svg fill="currentColor" height="14" viewBox="0 0 24 24" width="14">
                  <path d="M18 4c-1 0-2 .5-2.5 1.5C15 6.5 14 7 13 7H6.5C4 7 3 9 4 11c.5 1 2 2 3 2h7c1 0 2 1 2 2v2c0 1 .5 2 1.5 2.5S19 20 20 20c1.5 0 2-1 2-2V6c0-1-.5-2-1.5-2.5S19 3 18 4zm-9 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-[13px] text-dm-ink tracking-[-0.01em]">
                  Homebrew
                </div>
                <div className="text-[11px] text-dm-ink-4">macOS · Linux</div>
              </div>
              <div className="ml-auto font-[var(--font-dm-mono)] text-[11px] text-dm-ink-4">
                cask · recommended
              </div>
            </div>
            <button
              className="flex w-full cursor-pointer items-center gap-2 rounded-[8px] border border-dm-line bg-dm-bg-soft px-3 py-[10px] text-left font-[var(--font-dm-mono)] text-[12px] text-dm-ink-2 transition-colors hover:border-dm-line-strong"
              onClick={onCopy}
              type="button"
            >
              <span style={{ color: 'var(--color-dm-accent-2)' }}>$</span>
              <code className="flex-1 overflow-hidden truncate text-dm-ink">{cmd}</code>
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
                  <svg fill="none" height="11" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="11">
                    <rect height="13" rx="2" width="13" x="9" y="9" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
