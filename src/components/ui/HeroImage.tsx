import Image from "next/image"

export default function HeroImage() {
  return (
    <section aria-label="Hero Image of the website" className="flow-root">
      <div className="rounded-xl md:rounded-2xl bg-slate-50/40 p-2 ring-1 ring-inset ring-slate-200/50 dark:bg-gray-900/70 dark:ring-white/10">
        <div className="rounded md:rounded-xl bg-white ring-1 ring-slate-900/5 dark:bg-slate-950 dark:ring-white/15">
          {/* <ThemedImage
            lightSrc="/screenshots/dashboard.png"
            darkSrc="/screenshots/dashboard.png"
            alt="dockerman dashboard"
            width={2400}
            height={1600}
            className="object-contain rounded md:rounded-xl shadow-2xl dark:shadow-indigo-600/10"
          /> */}
          <Image
            src="/screenshots/2.4.0/hero.png"
            alt="dockerman dashboard"
            width={2400}
            height={1600}
            quality={50}
            className="object-contain rounded md:rounded-xl shadow-2xl dark:shadow-indigo-600/10"
            priority={true}  // 确保首屏加载
          />
        </div>
      </div>
    </section>
  )
}
