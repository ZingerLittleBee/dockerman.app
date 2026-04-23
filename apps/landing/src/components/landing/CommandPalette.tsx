'use client'

import { useTypewriter } from './hooks/useTypewriter'

const LINES = ['start redis', 'ssh root@fly.dev', 'tunnel :3000 public', 'scan nginx:alpine']

export function CommandPalette() {
  const { text } = useTypewriter({ lines: LINES, charMs: 55, holdMs: 1100 })

  return (
    <div className="pointer-events-none absolute top-24 right-10 z-10 w-[380px] max-w-[90vw] rounded-[14px] border border-dm-line-strong bg-dm-bg-elev p-3 shadow-[0_30px_60px_-20px_rgb(0_0_0_/_0.4)]">
      <div className="mb-3 flex items-center gap-2 text-[11px] text-dm-ink-3">
        <span className="rounded-md border border-dm-line bg-dm-bg-soft px-[6px] py-[1px] font-[var(--font-dm-mono)] font-semibold">
          ⌘K
        </span>
        Command palette
      </div>
      <div className="flex items-center gap-2 rounded-md bg-dm-bg-soft px-3 py-2 font-[var(--font-dm-mono)] text-[13px] text-dm-ink">
        <span style={{ color: 'var(--color-dm-accent)' }}>›</span>
        <span>{text}</span>
        <span
          className="inline-block h-[14px] w-[7px] bg-dm-ink"
          style={{ animation: 'dm-pulse 1s step-end infinite' }}
        />
      </div>
      <div className="mt-2 grid gap-1 text-[12px] text-dm-ink-3">
        <HintRow hint="run command" kbd="↵" />
        <HintRow hint="complete" kbd="⇥" />
        <HintRow hint="all commands" kbd="?" />
      </div>
    </div>
  )
}

function HintRow({ kbd, hint }: { kbd: string; hint: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-md border border-dm-line bg-dm-bg-soft px-[6px] py-[1px] font-[var(--font-dm-mono)]">
        {kbd}
      </span>
      <span>{hint}</span>
    </div>
  )
}
