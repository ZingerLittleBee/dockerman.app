import { downloadsConfig } from "@/config/downloads";

export function IntegrityBar() {
  const { latest, updaterPublicKeyUrl } = downloadsConfig;
  return (
    <section className="px-8 py-6">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 rounded-[12px] border border-dm-line bg-dm-bg-elev px-5 py-3 text-[12px]">
        <span className="text-dm-ink-3">Verify your download</span>
        <div className="flex gap-6">
          <a href={latest.releaseUrl} className="text-dm-ink hover:underline"
            rel="noopener noreferrer"
            target="_blank">
            GitHub release &amp; assets
          </a>
          <a href={updaterPublicKeyUrl} className="text-dm-ink hover:underline"
            rel="noopener noreferrer"
            target="_blank">
            Tauri updater public key
          </a>
        </div>
      </div>
    </section>
  );
}
