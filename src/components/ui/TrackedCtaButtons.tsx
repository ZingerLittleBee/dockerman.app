"use client"

import { siteConfig } from "@/app/siteConfig"
import posthog from "posthog-js"
import { Button } from "../Button"

export function TrackedCtaDownloadButton() {
  return (
    <a
      href={siteConfig.baseLinks.download}
      onClick={() => {
        posthog.capture("cta_download_clicked", {
          button_text: "Download for Desktop",
          location: "cta_section",
        })
      }}
    >
      <Button className="h-10 w-full sm:w-fit sm:flex-none" variant="primary">
        Download for Desktop
      </Button>
    </a>
  )
}

export function TrackedChangelogLink() {
  return (
    <a
      href={siteConfig.baseLinks.changelog}
      className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-500 dark:hover:text-indigo-400"
      onClick={() => {
        posthog.capture("changelog_link_clicked", {
          link_text: "View the Changelog",
          location: "cta_section",
        })
      }}
    >
      View the Changelog
    </a>
  )
}
