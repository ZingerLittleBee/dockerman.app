const EMAIL_RE_SPLIT = /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi
const EMAIL_RE_TEST = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export function PricingFaqAnswer({ text }: { text: string }) {
  const parts = text.split(EMAIL_RE_SPLIT).filter(Boolean)

  return parts.map((part) =>
    EMAIL_RE_TEST.test(part) ? (
      <a
        className="text-dm-accent-2 underline underline-offset-2 hover:opacity-80"
        href={`mailto:${part}`}
        key={`email-${part}`}
      >
        {part}
      </a>
    ) : (
      <span key={`text-${part}`}>{part}</span>
    )
  )
}
