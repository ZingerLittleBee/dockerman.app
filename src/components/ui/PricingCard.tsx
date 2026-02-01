'use client'

import { RiCheckLine } from '@remixicon/react'
import { motion } from 'motion/react'
import { cx } from '@/lib/utils'
import { Button } from '../Button'

interface PricingCardProps {
  title: string
  description?: string
  price: number
  originalPrice?: number
  features: string[]
  ctaText: string
  ctaHref?: string
  disabled?: boolean
  highlighted?: boolean
  badgeText?: string
  updatePolicy?: string
}

const formatPrice = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount)

export function PricingCard({
  title,
  description,
  price,
  originalPrice,
  features,
  ctaText,
  ctaHref,
  disabled = false,
  highlighted = false,
  badgeText,
  updatePolicy
}: PricingCardProps) {
  const cardClasses = cx(
    'relative flex flex-col rounded-2xl p-6 sm:p-8',
    'ring-1 transition-shadow duration-200',
    highlighted
      ? 'bg-gradient-to-b from-indigo-50 to-white ring-2 ring-indigo-500 dark:from-indigo-950/50 dark:to-gray-900 dark:ring-indigo-400'
      : 'bg-white ring-gray-200 dark:bg-gray-900 dark:ring-gray-800'
  )

  return (
    <motion.div
      className={cardClasses}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {badgeText && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-indigo-600 px-3 py-1 font-medium text-white text-xs dark:bg-indigo-500">
            {badgeText}
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="font-bold text-gray-900 text-lg tracking-tight dark:text-gray-100">
          {title}
        </h3>

        <div className="mt-4 flex items-baseline justify-center gap-2">
          <span
            aria-label={`${price} dollars`}
            className="font-bold text-4xl text-gray-900 tabular-nums dark:text-gray-100"
          >
            {formatPrice(price)}
          </span>
          {originalPrice && (
            <del
              aria-label={`originally ${originalPrice} dollars`}
              className="text-gray-400 text-lg tabular-nums dark:text-gray-500"
            >
              {formatPrice(originalPrice)}
            </del>
          )}
        </div>
      </div>

      <div className="mt-6 flex-1">
        <ul className="space-y-3 text-left">
          {description && (
            <li className="flex items-start gap-3">
              <RiCheckLine className="mt-0.5 size-5 shrink-0 text-indigo-500" />
              <span className="text-gray-600 text-sm dark:text-gray-400">{description}</span>
            </li>
          )}
          {features.map((feature) => (
            <li className="flex items-start gap-3" key={feature}>
              <RiCheckLine className="mt-0.5 size-5 shrink-0 text-indigo-500" />
              <span className="text-gray-600 text-sm dark:text-gray-400">{feature}</span>
            </li>
          ))}
        </ul>

        {updatePolicy && (
          <p className="mt-3 flex items-start gap-3 text-gray-600 text-sm dark:text-gray-400">
            <RiCheckLine className="mt-0.5 size-5 shrink-0 text-indigo-500" />
            {updatePolicy}
          </p>
        )}
      </div>

      <div className="mt-8">
        {ctaHref ? (
          <a
            aria-label={`${ctaText} - ${title}`}
            href={ctaHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Button className="w-full" variant={highlighted ? 'primary' : 'secondary'}>
              {ctaText}
            </Button>
          </a>
        ) : (
          <Button aria-label={ctaText} className="w-full" disabled={disabled} variant="secondary">
            {ctaText}
          </Button>
        )}
      </div>
    </motion.div>
  )
}
