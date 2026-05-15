type JsonLdData = Record<string, unknown>

// Escape `<` so a value containing `</script>` (e.g. an MDX frontmatter
// description) cannot break out of the script element.
function serialize(item: JsonLdData): string {
  return JSON.stringify(item).replace(/</g, '\\u003c')
}

export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  const items = Array.isArray(data) ? data : [data]
  return (
    <>
      {items.map((item, i) => (
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: required for JSON-LD structured data
          // biome-ignore lint/suspicious/noArrayIndexKey: stable JSON-LD list per render
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialize(item) }}
        />
      ))}
    </>
  )
}
