import { isRecord } from '@/lib/typeGuards'

export function parseJsonRequestBody(body: BodyInit | null | undefined) {
  if (typeof body !== 'string') {
    throw new Error('Expected a JSON string request body')
  }

  const parsed: unknown = JSON.parse(body)
  if (!isRecord(parsed)) {
    throw new Error('Expected a JSON object request body')
  }

  return parsed
}
