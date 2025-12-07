"use client"
import * as Tabs from "@radix-ui/react-tabs"
import { RemixiconComponentType } from "@remixicon/react"
import clsx from "clsx"
import { AnimatePresence, motion } from "motion/react"
import { memo, useState } from "react"

interface Tab {
  label: string
  icon: RemixiconComponentType
  content: React.ReactNode
}


function SnapshotPlaygourndTabs({ tabs }: { tabs: Tab[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.label)

  return (
    <Tabs.Root
      className="mt-14 grid grid-cols-12 gap-8 md:gap-12"
      value={activeTab}
      onValueChange={setActiveTab}
      orientation="vertical"
    >
      <Tabs.List
        className="col-span-full flex flex-row flex-wrap gap-2 md:col-span-3 md:flex-col md:gap-3"
        aria-label="Select view"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.label
          return (
            <Tabs.Trigger
              key={tab.label}
              className="group relative flex flex-1 items-center justify-start gap-4 rounded-xl px-4 py-3 text-left transition-colors md:flex-none"
              value={tab.label}
              style={{
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute inset-0 rounded-xl bg-gray-100 shadow-sm dark:bg-white/5 dark:shadow-indigo-900/10"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}
              <span className="relative z-10 flex w-full items-center gap-3">
                <span
                  className={clsx(
                    "flex size-9 items-center justify-center rounded-lg border transition-colors duration-300",
                    isActive
                      ? "border-gray-200 bg-white text-indigo-600 dark:border-white/10 dark:bg-gray-800 dark:text-indigo-400"
                      : "border-transparent bg-transparent text-gray-500 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-300",
                  )}
                >
                  <tab.icon className="size-5" />
                </span>
                <span
                  className={clsx(
                    "font-medium transition-colors duration-300",
                    isActive
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-500 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-300",
                  )}
                >
                  {tab.label}
                </span>
              </span>
            </Tabs.Trigger>
          )
        })}
      </Tabs.List>
      <div className="relative col-span-full min-h-[500px] md:col-span-9">
        <AnimatePresence mode="wait">
          {tabs.map((tab) =>
            tab.label === activeTab ? (
              <Tabs.Content key={tab.label} value={tab.label} asChild forceMount>
                <motion.div
                  className="relative w-full outline-none"
                  initial={{ opacity: 0, scale: 0.98, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 1.02, x: -10 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                >
                  {tab.content}
                </motion.div>
              </Tabs.Content>
            ) : null,
          )}
        </AnimatePresence>
      </div>
    </Tabs.Root>
  )
}




export default memo(SnapshotPlaygourndTabs)
