export type Verification =
  | { kind: 'apple-notarized' }
  | { kind: 'tauri-sig'; sigFilename: string }
  | { kind: 'none' }

export interface InstallerAsset {
  filename: string
  label: string
  size: string
  verification: Verification
}

export interface UpdaterBundle {
  filename: string
  sigFilename: string
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
  updaterBundles: {
    macos: UpdaterBundle
  }
}

export interface DownloadsHistoryEntry {
  version: string
  date: string
  summarySlug: string
}

const VERSION = '5.1.0'
const RELEASE_DATE = '2026-04-08'

export const downloadsConfig: {
  asOf: string
  latest: DownloadsLatest
  history: DownloadsHistoryEntry[]
  assetsBaseUrl: string
  updaterPublicKeyUrl: string
  homebrewCommand: string
} = {
  asOf: '2026-04-23',
  assetsBaseUrl: `https://github.com/ZingerLittleBee/dockerman.app/releases/download/app-v${VERSION}`,
  updaterPublicKeyUrl: 'https://github.com/ZingerLittleBee/dockerman.app#updater-key',
  homebrewCommand: 'brew install --cask zingerlittlebee/tap/dockerman',
  latest: {
    version: VERSION,
    releaseDate: RELEASE_DATE,
    releaseUrl: `https://github.com/ZingerLittleBee/dockerman.app/releases/tag/app-v${VERSION}`,
    installers: {
      macos: [
        {
          filename: `Dockerman_${VERSION}_universal.dmg`,
          label: 'Universal (Apple Silicon & Intel)',
          size: '43 MB',
          verification: { kind: 'apple-notarized' }
        }
      ],
      windows: [
        {
          filename: `Dockerman_${VERSION}_x64-setup.exe`,
          label: 'Windows x64 (installer)',
          size: '18 MB',
          verification: {
            kind: 'tauri-sig',
            sigFilename: `Dockerman_${VERSION}_x64-setup.exe.sig`
          }
        },
        {
          filename: `Dockerman_${VERSION}_x64_en-US.msi`,
          label: 'Windows x64 (MSI, for admins)',
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
          label: 'AppImage (x86_64)',
          size: '93 MB',
          verification: {
            kind: 'tauri-sig',
            sigFilename: `Dockerman_${VERSION}_amd64.AppImage.sig`
          }
        },
        {
          filename: `Dockerman_${VERSION}_amd64.deb`,
          label: 'Debian / Ubuntu (x86_64)',
          size: '24 MB',
          verification: { kind: 'none' }
        },
        {
          filename: `Dockerman-${VERSION}-1.x86_64.rpm`,
          label: 'Fedora / RHEL (x86_64)',
          size: '24 MB',
          verification: {
            kind: 'tauri-sig',
            sigFilename: `Dockerman-${VERSION}-1.x86_64.rpm.sig`
          }
        }
      ]
    },
    updaterBundles: {
      macos: {
        filename: 'Dockerman.app.tar.gz',
        sigFilename: 'Dockerman.app.tar.gz.sig'
      }
    }
  },
  history: [
    { version: '5.1.0', date: '2026-04-08', summarySlug: 'release-v5-1-0' },
    { version: '5.0.4', date: '2026-03-18', summarySlug: 'release-v5-0-4' },
    { version: '5.0.0', date: '2026-02-20', summarySlug: 'release-v5-0-0' },
    { version: '4.8.0', date: '2026-01-10', summarySlug: 'release-v4-8-0' },
    { version: '4.6.2', date: '2025-12-02', summarySlug: 'release-v4-6-2' },
    { version: '4.5.0', date: '2025-10-15', summarySlug: 'release-v4-5-0' },
    { version: '4.2.0', date: '2025-08-22', summarySlug: 'release-v4-2-0' },
    { version: '4.0.0', date: '2025-06-30', summarySlug: 'release-v4-0-0' }
  ]
}
