import type { Metadata } from "next";
import type { Locale } from "@repo/shared/i18n";
import { DownloadHero } from "@/components/download/DownloadHero";
import { HomebrewBlock } from "@/components/download/HomebrewBlock";
import { IntegrityBar } from "@/components/download/IntegrityBar";
import { PlatformCard } from "@/components/download/PlatformCard";
import { ReleasesTable } from "@/components/download/ReleasesTable";
import { CtaFinal } from "@/components/landing/CtaFinal";
import { downloadsConfig } from "@/config/downloads";

export const metadata: Metadata = {
  title: "Download — Dockerman",
  description: "Download Dockerman for macOS, Windows, and Linux."
};

export default async function DownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const { installers } = downloadsConfig.latest;

  return (
    <main>
      <DownloadHero />
      <HomebrewBlock />
      <section className="px-8 py-4">
        <div className="mx-auto grid max-w-[1240px] gap-4 md:grid-cols-3">
          <PlatformCard title="macOS" minSpec="macOS 11 Big Sur or later" assets={installers.macos} />
          <PlatformCard title="Windows" minSpec="Windows 10 / 11 x64" assets={installers.windows} />
          <PlatformCard title="Linux" minSpec="glibc 2.31+ · x86_64" assets={installers.linux} />
        </div>
      </section>
      <IntegrityBar />
      <ReleasesTable locale={l} />
      <CtaFinal locale={l} />
    </main>
  );
}
