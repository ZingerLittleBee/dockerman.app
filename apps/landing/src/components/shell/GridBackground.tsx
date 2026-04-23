export function GridBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundImage:
          'linear-gradient(var(--color-dm-grid) 1px, transparent 1px), linear-gradient(90deg, var(--color-dm-grid) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
        maskImage:
          'radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.7), transparent 70%)',
        WebkitMaskImage:
          'radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.7), transparent 70%)'
      }}
    />
  )
}
