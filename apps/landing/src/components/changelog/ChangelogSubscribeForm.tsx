'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'

interface ChangelogSubscribeFormProps {
  copy: {
    button: string
    description: string
    error: string
    fallbackSuccess: string
    notice: string
    placeholder: string
    success: string
    title: string
  }
}

export type ChangelogSubscribeCopy = ChangelogSubscribeFormProps['copy']

type FeedbackState =
  | {
      message: string
      tone: 'error' | 'success'
    }
  | undefined

export default function ChangelogSubscribeForm({ copy }: ChangelogSubscribeFormProps) {
  const [email, setEmail] = useState('')
  const [feedback, setFeedback] = useState<FeedbackState>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setFeedback({
        message: copy.error,
        tone: 'error'
      })
      return
    }

    setIsSubmitting(true)
    setFeedback(undefined)

    try {
      const response = await fetch('/api/changelog-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: trimmedEmail })
      })

      const payload = (await response.json().catch(() => null)) as {
        error?: string
        href?: string
        mode?: string
      } | null

      if (!response.ok) {
        setFeedback({
          message: payload?.error ?? copy.error,
          tone: 'error'
        })
        return
      }

      if (payload?.mode === 'mailto' && payload.href) {
        window.location.href = payload.href
        setFeedback({
          message: copy.fallbackSuccess,
          tone: 'success'
        })
        return
      }

      setEmail('')
      setFeedback({
        message: copy.success,
        tone: 'success'
      })
    } catch {
      setFeedback({
        message: copy.error,
        tone: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="border-gray-200 border-t pt-12 dark:border-gray-800">
      <div className="max-w-2xl">
        <h2 className="font-semibold text-2xl text-gray-950 tracking-tight dark:text-gray-50">
          {copy.title}
        </h2>
        <p className="mt-3 text-gray-600 leading-7 dark:text-gray-400">{copy.description}</p>
      </div>

      <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <Input
          autoComplete="email"
          className="flex-1"
          inputClassName="h-11"
          onChange={(event) => setEmail(event.target.value)}
          placeholder={copy.placeholder}
          required
          type="email"
          value={email}
        />
        <Button className="h-11 px-5" isLoading={isSubmitting} type="submit">
          {copy.button}
        </Button>
      </form>

      <p className="mt-3 text-gray-500 text-sm dark:text-gray-500">{copy.notice}</p>

      {feedback ? (
        <p
          className={`mt-4 text-sm ${
            feedback.tone === 'success'
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {feedback.message}
        </p>
      ) : null}
    </section>
  )
}
