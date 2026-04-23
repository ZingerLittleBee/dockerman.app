import Link from "next/link";
import type { Locale } from "@repo/shared/i18n";
import { downloadsConfig } from "@/config/downloads";

export function ReleasesTable({ locale }: { locale: Locale }) {
  return (
    <section className="px-8 py-8">
      <div className="mx-auto max-w-[1240px]">
        <h2 className="mb-4 font-semibold text-[20px] text-dm-ink">Previous releases</h2>
        <div className="overflow-hidden rounded-[12px] border border-dm-line">
          <table className="w-full border-collapse text-[13px]">
            <thead className="bg-dm-bg-soft text-dm-ink-3">
              <tr>
                <th className="px-4 py-2 text-left font-normal">Version</th>
                <th className="px-4 py-2 text-left font-normal">Date</th>
                <th className="px-4 py-2 text-left font-normal">Changelog</th>
              </tr>
            </thead>
            <tbody>
              {downloadsConfig.history.map((h, i) => (
                <tr key={h.version} className={i === 0 ? "bg-dm-bg-elev" : ""}>
                  <td className="px-4 py-3 font-[var(--font-dm-mono)] text-dm-ink">
                    v{h.version}
                  </td>
                  <td className="px-4 py-3 text-dm-ink-2">{h.date}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/${locale}/changelog#${h.summarySlug}`}
                      className="text-dm-ink hover:underline"
                    >
                      View notes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
