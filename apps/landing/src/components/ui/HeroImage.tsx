import Image from 'next/image'

export default function HeroImage() {
  return (
    <section aria-label="Hero Image of the website" className="flow-root">
      <div className="rounded-xl bg-slate-50/40 p-2 ring-1 ring-slate-200/50 ring-inset md:rounded-2xl dark:bg-gray-900/70 dark:ring-white/10">
        <div className="rounded bg-white ring-1 ring-slate-900/5 md:rounded-xl dark:bg-slate-950 dark:ring-white/15">
          <Image
            alt="dockerman dashboard"
            className="rounded object-contain shadow-2xl md:rounded-xl dark:hidden"
            height={1600}
            priority={true}
            quality={100}
            src="/screenshots/dashboard.png"
            width={2400}
          />
          <Image
            alt="dockerman dashboard"
            className="hidden rounded object-contain shadow-2xl md:rounded-xl dark:block dark:shadow-indigo-600/10"
            height={1600}
            priority={true}
            quality={100}
            src="/screenshots/dashboard-dark.png"
            width={2400}
          />
        </div>
      </div>
    </section>
  )
}
