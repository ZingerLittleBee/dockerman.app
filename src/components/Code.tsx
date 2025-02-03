import { cx } from "@/lib/utils"
import type { BundledLanguage, BundledTheme } from "shiki"
import { codeToHtml } from "shiki"
import CopyToClipboard from "./CopyToClipboard"

type Props = {
  code: string
  lang?: BundledLanguage
  theme?: BundledTheme
  filename?: string
  copy?: boolean
  className?: string
}

export default async function Code({
  code,
  lang = "typescript",
  copy = false,
  // tokyo-night
  // catppuccin-macchiato
  // min-dark
  // poimandres
  theme = "poimandres",
  className,
}: Props) {
  const html = await codeToHtml(code, {
    lang,
    theme,
  })

  return (
    <div
      className={cx(
        "relative w-full overflow-auto rounded-xl bg-gray-950 shadow-xl shadow-black/40 ring-1 ring-black dark:shadow-indigo-900/30 dark:ring-white/5",
        className,
      )}
    >
      {copy && (
        <div className="absolute right-0 h-full w-24 bg-gradient-to-r from-gray-900/0 via-gray-900/70 to-gray-900">
          <div className="absolute right-3 top-3">
            <CopyToClipboard code={code} />
          </div>
        </div>
      )}

      <div
        className="text-sm [&>pre]:overflow-x-auto [&>pre]:!bg-gray-950 [&>pre]:py-6 [&>pre]:pl-4 [&>pre]:pr-5 [&>pre]:leading-snug [&>pre]:dark:!bg-gray-950 [&_code]:block [&_code]:w-fit [&_code]:min-w-full"
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </div>
  )
}
