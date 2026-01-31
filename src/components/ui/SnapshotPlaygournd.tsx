'use client'

import { useTranslation } from '@/lib/i18n/client'
import {
  RiDashboardLine,
  RiFileLine,
  RiFileList2Line,
  RiHammerLine,
  RiInformation2Line,
  RiLineChartFill,
  RiNewsLine,
  RiPieChartLine,
  RiPlugLine,
  RiRemoteControlLine,
  RiShieldKeyholeLine,
  RiStackLine,
  RiTerminalBoxLine,
  RiTerminalLine,
  RiWindowLine
} from '@remixicon/react'
import { Badge } from '../Badge'
import SnapshotPlaygroundScroll from './SnapshotPlaygroundScroll'

const screenshotConfigs = [
  { src: '/screenshots/dashboard.png', labelKey: 'dashboard', icon: RiDashboardLine },
  { src: '/screenshots/terminal.png', labelKey: 'terminal', icon: RiTerminalBoxLine },
  { src: '/screenshots/process.png', labelKey: 'processes', icon: RiWindowLine },
  { src: '/screenshots/inspect.png', labelKey: 'inspect', icon: RiInformation2Line },
  { src: '/screenshots/stats.png', labelKey: 'stats', icon: RiLineChartFill },
  { src: '/screenshots/logs.png', labelKey: 'logs', icon: RiNewsLine },
  { src: '/screenshots/ssh.png', labelKey: 'ssh', icon: RiTerminalLine },
  { src: '/screenshots/build-history.png', labelKey: 'build', icon: RiHammerLine },
  { src: '/screenshots/event.png', labelKey: 'events', icon: RiFileList2Line },
  { src: '/screenshots/file.png', labelKey: 'file', icon: RiFileLine },
  { src: '/screenshots/image-analysis.png', labelKey: 'imageAnalysis', icon: RiPieChartLine },
  { src: '/screenshots/container-compose.png', labelKey: 'compose', icon: RiStackLine }
]

const featureConfigs = [
  { key: 'realTimeMonitoring', icon: RiStackLine },
  { key: 'containerManagement', icon: RiPlugLine },
  { key: 'remoteConnectivity', icon: RiRemoteControlLine },
  { key: 'powerfulPerformance', icon: RiShieldKeyholeLine }
]

export default function SnapshotPlaygournd() {
  const { t } = useTranslation()

  const screenshots = screenshotConfigs.map((config) => ({
    src: config.src,
    alt: t(`snapshot.tabs.${config.labelKey}`),
    label: t(`snapshot.tabs.${config.labelKey}`),
    icon: config.icon
  }))

  const features = featureConfigs.map((config) => ({
    name: t(`snapshot.features.${config.key}.name`),
    description: t(`snapshot.features.${config.key}.description`),
    icon: config.icon
  }))

  return (
    <section aria-labelledby="code-example-title" className="mx-auto mt-28 w-full max-w-6xl px-3">
      <Badge>{t('snapshot.badge')}</Badge>
      <h2
        className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 font-bold text-4xl text-transparent tracking-tighter sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
        id="code-example-title"
      >
        {t('snapshot.title')} <br /> {t('snapshot.titleBreak')}
      </h2>
      <p className="mt-6 max-w-2xl text-gray-600 text-lg dark:text-gray-400">
        {t('snapshot.description')}
      </p>

      <SnapshotPlaygroundScroll screenshots={screenshots} />

      <dl className="mt-24 grid grid-cols-4 gap-10">
        {features.map((item) => (
          <div className="col-span-full sm:col-span-2 lg:col-span-1" key={item.name}>
            <div className="w-fit rounded-lg p-2 shadow-indigo-400/30 shadow-md ring-1 ring-black/5 dark:shadow-indigo-600/30 dark:ring-white/5">
              <item.icon
                aria-hidden="true"
                className="size-6 text-indigo-600 dark:text-indigo-400"
              />
            </div>
            <dt className="mt-6 font-semibold text-gray-900 dark:text-gray-50">{item.name}</dt>
            <dd className="mt-2 text-gray-600 leading-7 dark:text-gray-400">{item.description}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
