export function FeaturesGrid() {
  return (
    <section className="px-8 py-16">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-10 max-w-[52ch]">
          <div
            className="font-[var(--font-dm-mono)] text-[11px] text-dm-accent uppercase tracking-wider"
            style={{ color: 'var(--color-dm-accent)' }}
          >
            Features
          </div>
          <h2 className="mt-2 font-bold text-[42px] text-dm-ink leading-[1.05] tracking-[-0.03em]">
            Built for the way you actually work.
          </h2>
        </div>

        <div className="grid auto-rows-[220px] grid-cols-6 gap-4">
          <PaletteCard />
          <DockerPodmanCard />
          <EventsCard />
          <PodmanNativeCard />
          <ImageUpgradeCard />
          <TrivyCard />
        </div>
      </div>
    </section>
  )
}

function PaletteCard() {
  return (
    <article className="col-span-4 row-span-2 rounded-[14px] border border-dm-line bg-dm-bg-elev p-6">
      <div className="text-[12px] text-dm-ink-3" style={{ fontFamily: 'var(--font-dm-mono)' }}>
        ⌘K · Command palette
      </div>
      <h3 className="mt-2 font-bold text-[24px] text-dm-ink">Everything, one keystroke away.</h3>
      <p className="mt-3 max-w-[46ch] text-[14px] text-dm-ink-2">
        Start containers, open terminals, tunnel ports, inspect images. Full fuzzy search over every
        resource and every action — never leave the keyboard.
      </p>
    </article>
  )
}

function DockerPodmanCard() {
  return (
    <article className="col-span-2 rounded-[14px] border border-dm-line bg-dm-bg-elev p-5">
      <div className="text-[12px] text-dm-ink-3" style={{ fontFamily: 'var(--font-dm-mono)' }}>
        Runtime
      </div>
      <h3 className="mt-2 font-semibold text-[17px] text-dm-ink">Docker or Podman. Your pick.</h3>
      <p className="mt-2 text-[13px] text-dm-ink-2">
        Auto-detection per host. Mix both on the same machine.
      </p>
    </article>
  )
}

function EventsCard() {
  return (
    <article className="col-span-2 rounded-[14px] border border-dm-line bg-dm-bg-elev p-5">
      <div className="text-[12px] text-dm-ink-3" style={{ fontFamily: 'var(--font-dm-mono)' }}>
        Events
      </div>
      <h3 className="mt-2 font-semibold text-[17px] text-dm-ink">Events, loud and legible.</h3>
      <p className="mt-2 text-[13px] text-dm-ink-2">
        Every pull, restart, and crash in a readable timeline — not a wall of logs.
      </p>
    </article>
  )
}

function PodmanNativeCard() {
  return (
    <article className="col-span-2 rounded-[14px] border border-dm-line bg-dm-bg-elev p-5">
      <div className="text-[12px] text-dm-ink-3" style={{ fontFamily: 'var(--font-dm-mono)' }}>
        Podman
      </div>
      <h3 className="mt-2 font-semibold text-[17px] text-dm-ink">First-class Podman.</h3>
      <p className="mt-2 text-[13px] text-dm-ink-2">
        Rootless and rootful sockets discovered automatically. No configuration.
      </p>
    </article>
  )
}

function ImageUpgradeCard() {
  return (
    <article className="col-span-2 rounded-[14px] border border-dm-line bg-dm-bg-elev p-5">
      <div className="text-[12px] text-dm-ink-3" style={{ fontFamily: 'var(--font-dm-mono)' }}>
        Upgrades
      </div>
      <h3 className="mt-2 font-semibold text-[17px] text-dm-ink">Image upgrade, with rollback.</h3>
      <p className="mt-2 text-[13px] text-dm-ink-2">
        Digest-aware. One click forward, one click back.
      </p>
    </article>
  )
}

function TrivyCard() {
  return (
    <article className="col-span-2 rounded-[14px] border border-dm-line bg-dm-bg-elev p-5">
      <div className="text-[12px] text-dm-ink-3" style={{ fontFamily: 'var(--font-dm-mono)' }}>
        Security
      </div>
      <h3 className="mt-2 font-semibold text-[17px] text-dm-ink">Images you can trust.</h3>
      <p className="mt-2 text-[13px] text-dm-ink-2">
        Inline Trivy CVE scans. Registry credentials stored in OS keychain.
      </p>
    </article>
  )
}
