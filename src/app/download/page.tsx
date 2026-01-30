"use client"

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import {
  RiAppleFill,
  RiBeerFill,
  RiCheckLine,
  RiFileCopy2Line,
  RiUbuntuFill,
  RiWindowsFill,
} from "@remixicon/react"
import posthog from "posthog-js"
import { useEffect, useState } from "react"
import Balancer from "react-wrap-balancer"
import { siteConfig } from "../siteConfig"

const CURRENT_VERSION = siteConfig.latestVersion

const DOWNLOAD_OPTIONS = [
  {
    title: "macOS",
    icon: RiAppleFill,
    options: [
      {
        name: "Universal (M1/Intel)",
        filename: `Dockerman_${CURRENT_VERSION}_universal.dmg`,
        ext: "dmg",
      },
    ],
  },
  {
    title: "Windows",
    icon: RiWindowsFill,
    options: [
      {
        name: "Windows (64-bit)",
        filename: `Dockerman_${CURRENT_VERSION}_x64_en-US.msi`,
        ext: "msi",
        preview: true,
      },
    ],
  },
  {
    title: "Linux",
    icon: RiUbuntuFill,
    disabled: true,
    options: [
      {
        name: "AppImage (64-bit)",
        filename: `Dockerman_${CURRENT_VERSION}_amd64.AppImage`,
        ext: "AppImage",
        preview: true,
      },
      {
        name: "Debian / Ubuntu",
        filename: `Dockerman_${CURRENT_VERSION}_amd64.deb`,
        ext: "deb",
        preview: true,
      },
      {
        name: "Red Hat / Fedora",
        filename: `Dockerman-${CURRENT_VERSION}-1.x86_64.rpm`,
        ext: "rpm",
        preview: true,
      },
    ],
  },
]

export default function Download() {
  const [copied, setCopied] = useState(false)

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
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>download</Badge>
        <h1
          id="download-overview"
          className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
        >
          <Balancer>Download for your platform</Balancer>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-700 dark:text-gray-400">
          Choose the version that matches your system. All downloads are
          available on{" "}
          <a
            href="https://assets.dockerman.app"
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              posthog.capture("external_link_clicked", {
                link_url: "https://assets.dockerman.app",
                link_text: "Releases Page",
                location: "download_page",
              })
            }}
          >
            Releases Page
          </a>
          .
        </p>
      </section>

      {/* Homebrew 部分 */}
      <section
        className="mt-10 animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <div className="max-w-3xl rounded-xl bg-white p-6 shadow-md shadow-gray-200/50 ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800">
          <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
            <RiBeerFill className="size-8" />
            Install with Homebrew
          </h2>
          <div className="group relative mt-4">
            <div className="flex items-center rounded-lg bg-gray-100 p-4 shadow-sm dark:bg-black">
              <code className="flex-grow overflow-auto whitespace-nowrap font-mono text-gray-900 dark:text-gray-100">
                brew install --cask zingerlittlebee/tap/dockerman
              </code>
              <button
                className="flex items-center rounded-md bg-gray-200 p-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-300 dark:bg-gray-900/50 dark:text-gray-400 dark:hover:bg-gray-800"
                onClick={() => {
                  navigator.clipboard.writeText(
                    "brew install --cask zingerlittlebee/tap/dockerman",
                  )
                  setCopied(true)
                  posthog.capture("homebrew_command_copied", {
                    command:
                      "brew install --cask zingerlittlebee/tap/dockerman",
                    version: CURRENT_VERSION,
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
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        {DOWNLOAD_OPTIONS.map((platform) => (
          <div
            key={platform.title}
            className="relative rounded-xl bg-white p-6 shadow-lg shadow-gray-200/50 ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800"
          >
            {platform.disabled && (
              <>
                <div className="absolute inset-0 z-10 rounded-xl bg-gray-200/60 dark:bg-gray-800/70 [&>div]:w-full">
                  <div className="flex justify-end pr-2 pt-2">
                    <Badge>Coming Soon</Badge>
                  </div>
                </div>
              </>
            )}
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              <platform.icon className="size-8" />
              {platform.title}
            </h2>
            <div className="mt-6 flex flex-col gap-3">
              {platform.options.map((option) => (
                <a
                  key={option.filename}
                  href={getDownloadUrl(option.filename)}
                  download
                  className="no-underline"
                  onClick={() => {
                    posthog.capture("download_button_clicked", {
                      platform: platform.title,
                      option_name: option.name,
                      file_extension: option.ext,
                      filename: option.filename,
                      version: CURRENT_VERSION,
                      is_preview: "preview" in option,
                    })
                  }}
                >
                  <Button
                    className="h-auto w-full justify-start py-3 text-left"
                    variant="secondary"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="font-medium">
                        {option.name}
                        {"preview" in option && (
                          <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-900 dark:text-slate-200">
                            Preview
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        {`.${option.ext}`}
                      </div>
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
