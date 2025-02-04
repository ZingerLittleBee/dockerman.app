'use client'

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { RiAppleFill, RiUbuntuFill, RiWindowsFill } from "@remixicon/react"
import Balancer from "react-wrap-balancer"

const DOWNLOAD_OPTIONS = [
  {
    title: "macOS",
    icon: RiAppleFill,
    options: [
      { name: "Apple Silicon (M1/M2)", arch: "aarch64", ext: "dmg" },
      { name: "Intel", arch: "x64", ext: "dmg" },
    ],
  },
  {
    title: "Windows",
    icon: RiWindowsFill,
    options: [
      { name: "Windows (64-bit)", arch: "x64", ext: "msi", preview: true },
    ],
  },
  {
    title: "Linux",
    icon: RiUbuntuFill,
    options: [
      { name: "AppImage (64-bit)", arch: "x64", ext: "AppImage", preview: true },
      { name: "Debian / Ubuntu", arch: "amd64", ext: "deb", preview: true },
    ],
  },
]

export default function Download() {
  const getDownloadUrl = (arch: string, ext: string) => {
    // Replace with your actual release URL pattern
    return `https://github.com/yourusername/dockerman/releases/latest/download/dockerman-${arch}.${ext}`
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
          <Balancer>
            Download for your platform
          </Balancer>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-700 dark:text-gray-400">
          Choose the version that matches your system. All downloads are available on{" "}
          <a
            href="https://assets.dockerman.app"
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            Releases Page
          </a>
          .
        </p>
      </section>

      <section className="grid gap-12 md:grid-cols-3 my-16">
        {DOWNLOAD_OPTIONS.map((platform) => (
          <div
            key={platform.title}
            className="rounded-xl bg-white p-6 shadow-lg shadow-gray-200/50 ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <platform.icon className="size-8" />
              {platform.title}
            </h2>
            <div className="mt-6 flex flex-col gap-3">
              {platform.options.map((option) => (
                <Button
                  key={option.arch}
                  className="h-auto w-full justify-start py-3 text-left"
                  variant="secondary"
                  onClick={() => window.open(getDownloadUrl(option.arch, option.ext), '_blank')}
                >
                  <div className="flex flex-col gap-2">
                    <div className="font-medium">
                      {option.name}
                      {'preview' in option && (
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
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}