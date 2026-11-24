'use client'

import type { Locale } from '@repo/shared/i18n'
import Link from 'next/link'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { downloadsConfig } from '@/config/downloads'
import s from './home.module.css'
import { DownloadIcon } from './primitives'

type OS = 'mac' | 'windows' | 'linux'

const OS_SIZE: Record<OS, string> = {
  mac: downloadsConfig.latest.installers.macos[0].size,
  windows: downloadsConfig.latest.installers.windows[0].size,
  linux: downloadsConfig.latest.installers.linux[0].size
}

const WINDOWS_RE = /Win/i
const LINUX_RE = /Linux/i
const ANDROID_RE = /Android/i

function detectOS(): OS {
  const ua = navigator.userAgent
  if (WINDOWS_RE.test(ua)) return 'windows'
  if (LINUX_RE.test(ua) && !ANDROID_RE.test(ua)) return 'linux'
  return 'mac'
}

function subscribeOS(listener: () => void) {
  queueMicrotask(listener)
  return () => undefined
}

const serverOS = (): OS => 'mac'

export interface DownloadCtaLabels {
  download: Record<OS, string>
  copy: string
  copied: string
  copyAria: string
}

/** Primary download button (labelled for the visitor's OS) plus the Homebrew command. */
export function DownloadCtas({ locale, labels }: { locale: Locale; labels: DownloadCtaLabels }) {
  const os = useSyncExternalStore(subscribeOS, detectOS, serverOS)
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(downloadsConfig.homebrewCommand)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard access can be denied; the command stays visible to copy by hand.
    }
  }

  return (
    <div className={s.ctas}>
      <Link className={s.btn} href={`/${locale}/download`}>
        <DownloadIcon />
        {labels.download[os]}
        <span className={`${s.pill} ${s.mono}`}>{OS_SIZE[os]}</span>
      </Link>
      <button
        aria-label={`${labels.copyAria}: ${downloadsConfig.homebrewCommand}`}
        className={`${s.cmd} ${s.mono}`}
        onClick={copy}
        type="button"
      >
        <span className={s.acc}>$</span>
        {downloadsConfig.homebrewCommand}
        <span aria-live="polite" className={s.cp}>
          {copied ? labels.copied : labels.copy}
        </span>
      </button>
    </div>
  )
}
