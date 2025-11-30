"use client"
import * as Tabs from "@radix-ui/react-tabs"
import { RemixiconComponentType } from "@remixicon/react"
import { AnimatePresence, motion } from "motion/react"
import { memo } from "react"

interface Tab {
  label: string
  icon: RemixiconComponentType
  content: React.ReactNode
}

function SnapshotPlaygourndTabs({ tabs }: { tabs: Tab[] }) {
  return (
    <Tabs.Root
      className="mt-14 grid grid-cols-12 gap-8"
      defaultValue={tabs[0]?.label}
      orientation="vertical"
    >
      <Tabs.List
        className="col-span-full grid h-fit w-full grid-cols-2 flex-col gap-4 md:order-2 md:col-span-3 md:flex"
        aria-label="Select view"
      >
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.label}
            className="group relative flex flex-1 flex-col items-start justify-center rounded-xl p-2 text-left shadow-lg ring-1 ring-gray-200 data-[state=active]:ring-indigo-400 md:p-4 dark:ring-white/5 dark:data-[state=active]:shadow-indigo-900/30"
            value={tab.label}
          >
            <div className="flex items-center gap-4">
              <div className="aspect-square w-fit rounded-lg bg-white p-2 text-gray-700 ring-1 ring-black/10 transition-all group-data-[state=active]:text-indigo-600 group-data-[state=active]:shadow-md group-data-[state=active]:shadow-indigo-500/20 dark:bg-gray-950 dark:text-gray-400 dark:ring-white/10 dark:group-data-[state=active]:text-indigo-400 dark:group-data-[state=active]:shadow-indigo-600/50">
                <tab.icon aria-hidden="true" className="size-5" />
              </div>
              <p className="font-semibold tracking-tight text-gray-700 transition-all group-data-[state=active]:text-indigo-600 sm:text-lg dark:text-gray-400 dark:group-data-[state=active]:text-indigo-400">
                {tab.label}
              </p>
            </div>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <div className="relative col-span-full md:col-span-9 md:min-h-[564px]">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            <Tabs.Content key={tab.label} value={tab.label} asChild>
              <motion.div
                className="relative w-full outline-none"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {tab.content}
              </motion.div>
            </Tabs.Content>
          ))}
        </AnimatePresence>
      </div>
    </Tabs.Root>
  )
}

export default memo(SnapshotPlaygourndTabs)
