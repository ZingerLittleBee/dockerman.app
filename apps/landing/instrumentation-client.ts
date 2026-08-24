import { createProductionBrowserPostHogInitializer } from './src/lib/analytics/initBrowserPostHog'
import { scheduleAfterLoadIdle } from './src/lib/analytics/scheduleAfterLoadIdle'

const initPostHog = createProductionBrowserPostHogInitializer()

scheduleAfterLoadIdle(initPostHog)
