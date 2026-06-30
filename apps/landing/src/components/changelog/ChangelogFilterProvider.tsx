'use client'

import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { ChangelogFilterContext } from './ChangelogFilterContext'

export function ChangelogFilterProvider({ children }: { children: ReactNode }) {
  const [visibleIds, setVisibleIds] = useState<string[] | null>(null)
  const value = useMemo(() => ({ setVisibleIds, visibleIds }), [visibleIds])

  return <ChangelogFilterContext.Provider value={value}>{children}</ChangelogFilterContext.Provider>
}
