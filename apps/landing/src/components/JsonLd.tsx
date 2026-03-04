interface JsonLdProps {
  // biome-ignore lint/suspicious/noExplicitAny: JSON-LD payloads are inherently dynamic
  data: Record<string, any>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      type="application/ld+json"
    />
  )
}
