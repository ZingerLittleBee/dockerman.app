'use client'

import {
  RiAppleFill,
  RiBeerFill,
  RiCheckLine,
  RiFileCopy2Line,
  RiUbuntuFill,
  RiWindowsFill
} from '@remixicon/react'
import posthog from 'posthog-js'
import { useEffect, useState } from 'react'
import Balancer from 'react-wrap-balancer'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { useTranslation } from '@/lib/i18n/client'
import { siteConfig } from '../../siteConfig'

const CURRENT_VERSION = siteConfig.latestVersion

export default function Download() {
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation()

  const DOWNLOAD_OPTIONS = [
    {
      titleKey: 'download.platforms.macos',
      icon: RiAppleFill,
      options: [
        {
          nameKey: 'download.options.universal',
          filename: `Dockerman_${CURRENT_VERSION}_universal.dmg`,
          ext: 'dmg'
        }
      ]
    },
    {
      titleKey: 'download.platforms.windows',
      icon: RiWindowsFill,
      options: [
        {
          nameKey: 'download.options.windows64',
          filename: `Dockerman_${CURRENT_VERSION}_x64-setup.exe`,
          ext: 'exe'
        }
      ]
    },
    {
      titleKey: 'download.platforms.linux',
      icon: RiUbuntuFill,
      options: [
        {
          nameKey: 'download.options.appimage',
          filename: `Dockerman_${CURRENT_VERSION}_amd64.AppImage`,
          ext: 'AppImage'
        }
      ]
    }
  ]

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [copied])

  const getDownloadUrl = (filename: string) => {
    return `https://assets.dockerman.app/${CURRENT_VERSION}/${filename}`
  }

  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <section
        aria-labelledby="download-overview"
        className="animate-slide-up-fade"
        style={{
          animationDuration: '600ms',
          animationFillMode: 'backwards'
        }}
      >
        <Badge>{t('download.badge')}</Badge>
        <h1
          className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 font-bold text-4xl text-transparent tracking-tighter sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
          id="download-overview"
        >
          <Balancer>{t('download.title')}</Balancer>
        </h1>
        <p className="mt-6 max-w-2xl text-gray-700 text-lg dark:text-gray-400">
          {t('download.description')}{' '}
          <a
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            href="https://assets.dockerman.app"
            onClick={() => {
              posthog.capture('external_link_clicked', {
                link_url: 'https://assets.dockerman.app',
                link_text: 'Releases Page',
                location: 'download_page'
              })
            }}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t('download.releasesPage')}
          </a>
          .
        </p>
      </section>

      {/* Homebrew 部分 */}
      <section
        className="mt-10 animate-slide-up-fade"
        style={{
          animationDuration: '600ms',
          animationFillMode: 'backwards'
        }}
      >
        <div className="max-w-3xl rounded-xl bg-white p-6 shadow-gray-200/50 shadow-md ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800">
          <h2 className="flex items-center gap-3 font-semibold text-gray-900 text-xl dark:text-gray-100">
            <RiBeerFill className="size-8" />
            {t('download.homebrew')}
          </h2>
          <div className="group relative mt-4">
            <div className="flex items-center rounded-lg bg-gray-100 p-4 shadow-sm dark:bg-black">
              <code className="flex-grow overflow-auto whitespace-nowrap font-mono text-gray-900 dark:text-gray-100">
                brew install --cask zingerlittlebee/tap/dockerman
              </code>
              <button
                className="flex items-center rounded-md bg-gray-200 p-2 font-medium text-gray-700 text-sm transition-all duration-300 hover:bg-gray-300 dark:bg-gray-900/50 dark:text-gray-400 dark:hover:bg-gray-800"
                onClick={() => {
                  navigator.clipboard.writeText('brew install --cask zingerlittlebee/tap/dockerman')
                  setCopied(true)
                  posthog.capture('homebrew_command_copied', {
                    command: 'brew install --cask zingerlittlebee/tap/dockerman',
                    version: CURRENT_VERSION
                  })
                }}
              >
                {copied ? (
                  <RiCheckLine className="size-4 transition-all duration-300" />
                ) : (
                  <RiFileCopy2Line className="size-4 transition-all duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        className="my-16 grid animate-slide-up-fade gap-12 md:grid-cols-3"
        style={{
          animationDuration: '600ms',
          animationFillMode: 'backwards'
        }}
      >
        {DOWNLOAD_OPTIONS.map((platform) => (
          <div
            className="relative rounded-xl bg-white p-6 shadow-gray-200/50 shadow-lg ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800"
            key={platform.titleKey}
          >
            <h2 className="flex items-center gap-2 font-semibold text-gray-900 text-xl dark:text-gray-100">
              <platform.icon className="size-8" />
              {t(platform.titleKey)}
            </h2>
            <div className="mt-6 flex flex-col gap-3">
              {platform.options.map((option) => (
                <a
                  className="no-underline"
                  download
                  href={getDownloadUrl(option.filename)}
                  key={option.filename}
                  onClick={() => {
                    posthog.capture('download_button_clicked', {
                      platform: t(platform.titleKey),
                      option_name: t(option.nameKey),
                      file_extension: option.ext,
                      filename: option.filename,
                      version: CURRENT_VERSION,
                      is_preview: 'preview' in option
                    })
                  }}
                >
                  <Button
                    className="h-auto w-full justify-start py-3 text-left"
                    variant="secondary"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="font-medium">
                        {t(option.nameKey)}
                      </div>
                      <div className="text-gray-400 text-sm">{`.${option.ext}`}</div>
                    </div>
                  </Button>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
