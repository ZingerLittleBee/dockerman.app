import { downloadsConfig, type InstallerAsset, type Verification } from "@/config/downloads";

function renderVerification(v: Verification): string | null {
  if (v.kind === "apple-notarized") return "Apple-signed & notarized";
  if (v.kind === "tauri-sig") return `Tauri updater signature: ${v.sigFilename}`;
  return null;
}

export function PlatformCard({
  title,
  minSpec,
  assets
}: {
  title: string;
  minSpec: string;
  assets: InstallerAsset[];
}) {
  return (
    <article className="flex flex-col rounded-[14px] border border-dm-line bg-dm-bg-elev p-5">
      <div className="text-[16px] font-semibold text-dm-ink">{title}</div>
      <div className="mt-1 text-[12px] text-dm-ink-3">{minSpec}</div>
      <ul className="mt-5 flex-1 space-y-2">
        {assets.map((a) => {
          const verificationLine = renderVerification(a.verification);
          return (
            <li key={a.filename}>
              <a
                href={`${downloadsConfig.assetsBaseUrl}/${a.filename}`}
                className="flex items-center justify-between rounded-md border border-dm-line px-3 py-[10px] text-[13px] text-dm-ink hover:bg-dm-bg-soft"
              >
                <span>{a.label}</span>
                <span className="font-[var(--font-dm-mono)] text-dm-ink-3">{a.size}</span>
              </a>
              {verificationLine && (
                <div className="mt-1 font-[var(--font-dm-mono)] text-[11px] text-dm-ink-4">
                  {verificationLine}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </article>
  );
}
