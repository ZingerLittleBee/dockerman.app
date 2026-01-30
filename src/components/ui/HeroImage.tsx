import Image from "next/image"

export default function HeroImage() {
  return (
    <section aria-label="Hero Image of the website" className="flow-root">
      <div className="rounded-xl bg-slate-50/40 p-2 ring-1 ring-inset ring-slate-200/50 md:rounded-2xl dark:bg-gray-900/70 dark:ring-white/10">
        <div className="rounded bg-white ring-1 ring-slate-900/5 md:rounded-xl dark:bg-slate-950 dark:ring-white/15">
          <Image
            src="/screenshots/dashboard.png"
            alt="dockerman dashboard"
            width={2400}
            height={1600}
            quality={100}
            className="rounded object-contain shadow-2xl md:rounded-xl dark:hidden"
            priority={true}
          />
          <Image
            src="/screenshots/dashboard-dark.png"
            alt="dockerman dashboard"
            width={2400}
            height={1600}
            quality={100}
            className="hidden rounded object-contain shadow-2xl md:rounded-xl dark:block dark:shadow-indigo-600/10"
            priority={true}
          />
        </div>
      </div>
    </section>
  )
}
