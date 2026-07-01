'use client'

import { createContext } from 'react'

export interface ChangelogFilterState {
  setVisibleIds: (visibleIds: string[] | null) => void
  visibleIds: string[] | null
}

export const ChangelogFilterContext = createContext<ChangelogFilterState | null>(null)
