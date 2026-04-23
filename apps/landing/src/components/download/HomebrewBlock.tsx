"use client";

import { useState } from "react";
import { RiCheckLine, RiFileCopy2Line } from "@remixicon/react";
import { downloadsConfig } from "@/config/downloads";

export function HomebrewBlock() {
  const [copied, setCopied] = useState(false);
  const cmd = downloadsConfig.homebrewCommand;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="px-8 py-6">
      <div className="mx-auto max-w-[1240px]">
        <div className="rounded-[14px] border border-dm-line bg-dm-bg-elev p-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="font-[var(--font-dm-mono)] text-[12px] text-dm-ink-3">
              Homebrew (recommended)
            </div>
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex items-center gap-1 rounded-md border border-dm-line px-2 py-1 text-[11px] text-dm-ink-2 hover:bg-dm-bg-soft"
            >
              {copied ? <RiCheckLine className="h-3 w-3" /> : <RiFileCopy2Line className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <code className="block rounded-md bg-dm-bg-soft p-3 font-[var(--font-dm-mono)] text-[14px] text-dm-ink">
            $ {cmd}
          </code>
        </div>
      </div>
    </section>
  );
}
