import { downloadsConfig } from "@/config/downloads";
import { Pill } from "@/components/ui/Pill";

export function DownloadHero() {
  const { latest } = downloadsConfig;
  return (
    <section className="px-8 pb-6 pt-16">
      <div className="mx-auto max-w-[1240px]">
        <Pill>v{latest.version} · latest stable</Pill>
        <h1 className="mt-5 max-w-[18ch] font-bold text-[clamp(40px,6vw,72px)] leading-[0.95] tracking-[-0.04em] text-dm-ink">
          Download{" "}
          <span className="font-[var(--font-dm-display)] italic text-dm-accent">
            for every platform.
          </span>
        </h1>
        <div className="mt-8 grid max-w-[820px] grid-cols-4 gap-6 border-t border-dm-line pt-6 text-[12px]">
          <Meta label="Version" value={`v${latest.version}`} />
          <Meta label="Released" value={latest.releaseDate} />
          <Meta label="Install size" value="~120 MB" />
          <Meta label="Platforms" value="macOS · Win · Linux" />
        </div>
      </div>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-[var(--font-dm-mono)] uppercase tracking-wider text-dm-ink-4">{label}</div>
      <div className="mt-1 text-dm-ink-2">{value}</div>
    </div>
  );
}
