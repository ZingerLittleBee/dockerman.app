import { siteConfig } from '@/app/siteConfig'

export type Verification =
  | { kind: 'apple-notarized' }
  | { kind: 'tauri-sig'; sigFilename: string }
  | { kind: 'none' }

export interface InstallerAsset {
  filename: string
  labelKey: string
  size: string
  verification: Verification
}

export interface DownloadsLatest {
  version: string
  releaseDate: string
  releaseUrl: string
  installers: {
    macos: InstallerAsset[]
    windows: InstallerAsset[]
    linux: InstallerAsset[]
  }
}

export interface DownloadsHistoryEntry {
  version: string
  date: string
  summarySlug: string
}

const VERSION = siteConfig.latestVersion
const RELEASE_DATE = '2026-04-26'

export const downloadsConfig: {
  asOf: string
  latest: DownloadsLatest
  history: DownloadsHistoryEntry[]
  assetsBaseUrl: string
  homebrewCommand: string
} = {
  asOf: '2026-04-23',
  assetsBaseUrl: `https://github.com/ZingerLittleBee/dockerman.app/releases/download/app-v${VERSION}`,
  homebrewCommand: 'brew install --cask zingerlittlebee/tap/dockerman',
  latest: {
    version: VERSION,
    releaseDate: RELEASE_DATE,
    releaseUrl: `https://github.com/ZingerLittleBee/dockerman.app/releases/tag/app-v${VERSION}`,
    installers: {
      macos: [
        {
          filename: `Dockerman_${VERSION}_universal.dmg`,
          labelKey: 'download.installers.macos.universal',
          size: '45 MB',
          verification: { kind: 'apple-notarized' }
        }
      ],
      windows: [
        {
          filename: `Dockerman_${VERSION}_x64-setup.exe`,
          labelKey: 'download.installers.windows.installer',
          size: '18 MB',
          verification: {
            kind: 'tauri-sig',
            sigFilename: `Dockerman_${VERSION}_x64-setup.exe.sig`
          }
        },
        {
          filename: `Dockerman_${VERSION}_x64_en-US.msi`,
          labelKey: 'download.installers.windows.msi',
          size: '25 MB',
          verification: {
            kind: 'tauri-sig',
            sigFilename: `Dockerman_${VERSION}_x64_en-US.msi.sig`
          }
        }
      ],
      linux: [
        {
          filename: `Dockerman_${VERSION}_amd64.AppImage`,
          labelKey: 'download.installers.linux.appimage',
          size: '98 MB',
          verification: {
            kind: 'tauri-sig',
            sigFilename: `Dockerman_${VERSION}_amd64.AppImage.sig`
          }
        },
        {
          filename: `Dockerman_${VERSION}_amd64.deb`,
          labelKey: 'download.installers.linux.deb',
          size: '25 MB',
          verification: { kind: 'none' }
        },
        {
          filename: `Dockerman-${VERSION}-1.x86_64.rpm`,
          labelKey: 'download.installers.linux.rpm',
          size: '25 MB',
          verification: {
            kind: 'tauri-sig',
            sigFilename: `Dockerman-${VERSION}-1.x86_64.rpm.sig`
          }
        }
      ]
    }
  },
  history: [
    { version: VERSION, date: RELEASE_DATE, summarySlug: 'release-5-2-0' },
    { version: '5.1.0', date: '2026-04-08', summarySlug: 'release-5-1-0' },
    { version: '5.0.0', date: '2026-04-07', summarySlug: 'release-5-0-0' },
    { version: '4.8.0', date: '2026-03-31', summarySlug: 'release-4-8-0' },
    { version: '4.7.0', date: '2026-03-29', summarySlug: 'release-4-7-0' },
    { version: '4.6.0', date: '2026-03-26', summarySlug: 'release-4-6-0' },
    { version: '4.5.0', date: '2026-03-21', summarySlug: 'release-4-5-0' },
    { version: '4.4.0', date: '2026-03-11', summarySlug: 'release-4-4-0' },
    { version: '4.3.0', date: '2026-03-08', summarySlug: 'release-4-3-0' }
  ]
}
