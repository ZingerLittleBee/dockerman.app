/**
 * Dockerman wordmark: the glyph sized to the cap height and baseline-aligned with the name,
 * so both read as one line at any font size.
 */
export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`group/brand inline-flex items-baseline gap-[0.5em] font-semibold leading-none tracking-[-0.015em] ${className}`}
    >
      <svg
        aria-hidden="true"
        className="relative top-[0.105em] h-[0.92em] w-[0.92em] shrink-0 fill-current stroke-current transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] [stroke-width:0.6] fine-hover:group-hover/brand:-rotate-8 motion-reduce:transition-none"
        viewBox="4 4 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M28,12H20V4h8Zm-6-2h4V6H22Z" />
        <path d="M17,15V9H9V23H23V15Zm-6-4h4v4H11Zm4,10H11V17h4Zm6,0H17V17h4Z" />
        <path d="M26,28H6a2,2,0,0,1-2-2V6A2,2,0,0,1,6,4H16V6H6V26H26V16h2V26A2,2,0,0,1,26,28Z" />
      </svg>
      <span>Dockerman</span>
    </span>
  )
}
