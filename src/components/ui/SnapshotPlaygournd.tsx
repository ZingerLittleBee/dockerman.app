"use client"

import {
  RiDashboardLine,
  RiInformation2Line,
  RiLineChartFill,
  RiNewsLine,
  RiPlugLine,
  RiRemoteControlLine,
  RiShieldKeyholeLine,
  RiStackLine,
  RiTerminalBoxLine,
  RiTerminalLine,
  RiWindowLine,
} from "@remixicon/react"
import Image from "next/image"
import { Badge } from "../Badge"
import SnapshotPlaygourndTabs from "./SnapshotPlaygourndTabs"

const screenshots = [
  {
    src: "/screenshots/2.4.0/dashboard.png",
    alt: "Dashboard Screenshot",
    label: "Dashboard",
    icon: RiDashboardLine,
  },
  {
    src: "/screenshots/2.4.0/terminal.png",
    alt: "Terminal Screenshot",
    label: "Terminal",
    icon: RiTerminalBoxLine,
  },
  {
    src: "/screenshots/2.4.0/process.png",
    alt: "Process List Screenshot",
    label: "Processes",
    icon: RiWindowLine,
  },
  {
    src: "/screenshots/2.4.0/inspect.png",
    alt: "Inspect Screenshot",
    label: "Inspect",
    icon: RiInformation2Line,
  },
  {
    src: "/screenshots/2.4.0/stat.png",
    alt: "Stats Screenshot",
    label: "Stats",
    icon: RiLineChartFill,
  },
  {
    src: "/screenshots/2.4.0/log.png",
    alt: "Logs Screenshot",
    label: "Logs",
    icon: RiNewsLine,
  },
  {
    src: "/screenshots/2.4.0/ssh.png",
    alt: "SSH Screenshot",
    label: "SSH",
    icon: RiTerminalLine,
  },
]

const features = [
  {
    name: "Real-time Monitoring",
    description:
      "Monitor container CPU, memory, network, and I/O metrics in real-time with powerful performance.",
    icon: RiStackLine,
  },
  {
    name: "Container Management",
    description:
      "Start, stop, inspect, and manage containers with an intuitive interface. Access integrated terminal and process list.",
    icon: RiPlugLine,
  },
  {
    name: "Remote Connectivity",
    description:
      "Connect to remote Docker instances securely via SSH. Manage containers across multiple hosts from a single interface.",
    icon: RiRemoteControlLine,
  },
  {
    name: "Powerful Performance",
    description:
      "Built with Tauri for lightning-fast startup and minimal resource usage while managing your Docker environment.",
    icon: RiShieldKeyholeLine,
  },
]

export default function SnapshotPlaygournd() {
  return (
    <section
      aria-labelledby="code-example-title"
      className="mx-auto mt-28 w-full max-w-6xl px-3"
    >
      <Badge>POWERFUL</Badge>
      <h2
        id="code-example-title"
        className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
      >
        Docker Management, <br /> Simplified
      </h2>
      <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
        A modern, lightweight Docker management UI that focuses on simplicity
        and performance. Monitor and manage your containers with cross-platform
        desktop integration.
      </p>

      <div className="mt-8">
        <SnapshotPlaygourndTabs
          tabs={screenshots.map((screenshot) => ({
            label: screenshot.label,
            icon: screenshot.icon,
            content: (
              <div className="overflow-hidden rounded-xl bg-slate-50/40 p-2 shadow-2xl ring-1 ring-inset ring-slate-200/50 md:rounded-2xl dark:bg-gray-900/70 dark:ring-white/10">
                <div className="rounded bg-white ring-1 ring-slate-900/5 md:rounded-xl dark:bg-slate-950 dark:ring-white/15">
                  <Image
                    src={screenshot.src}
                    alt={screenshot.alt}
                    className="rounded object-contain shadow md:rounded-xl dark:shadow-indigo-600/10"
                    quality={50}
                    width={1200}
                    height={900}
                  />
                </div>
              </div>
            ),
          }))}
        />
      </div>

      <dl className="mt-24 grid grid-cols-4 gap-10">
        {features.map((item) => (
          <div
            key={item.name}
            className="col-span-full sm:col-span-2 lg:col-span-1"
          >
            <div className="w-fit rounded-lg p-2 shadow-md shadow-indigo-400/30 ring-1 ring-black/5 dark:shadow-indigo-600/30 dark:ring-white/5">
              <item.icon
                aria-hidden="true"
                className="size-6 text-indigo-600 dark:text-indigo-400"
              />
            </div>
            <dt className="mt-6 font-semibold text-gray-900 dark:text-gray-50">
              {item.name}
            </dt>
            <dd className="mt-2 leading-7 text-gray-600 dark:text-gray-400">
              {item.description}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
