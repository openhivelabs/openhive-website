"use client";

import { useState } from "react";
import { Copy, Check } from "@phosphor-icons/react";

const CMD = "npm i -g openhiveai";

export function InstallTerminal() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="relative w-full max-w-2xl">
      {/* Soft glow behind */}
      <div
        className="pointer-events-none absolute -inset-6 rounded-[28px] opacity-50 blur-2xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 40%, color-mix(in oklab, var(--accent) 30%, transparent), transparent 70%)",
        }}
        aria-hidden
      />

      <div
        className="
          relative overflow-hidden rounded-2xl
          bg-[#fafaf7] text-zinc-900
          shadow-[0_1px_0_rgba(0,0,0,0.04)_inset,0_20px_60px_-25px_rgba(40,30,20,0.25),0_0_0_1px_rgba(0,0,0,0.08)]
          dark:bg-[#101015] dark:text-zinc-100
          dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_30px_80px_-30px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.06)]
        "
      >
        {/* Title bar */}
        <div
          className="
            flex items-center border-b px-4 py-2.5
            border-black/[0.06] bg-[#efece5]
            dark:border-white/[0.06] dark:bg-[#16161c]
          "
        >
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
        </div>

        {/* Body */}
        <div className="flex items-center gap-3 px-5 py-3.5 text-left sm:px-6 sm:py-4">
          <span className="font-mono text-[15px] text-[#cc785c] dark:text-[#f97362]">
            $
          </span>
          <code className="flex-1 font-mono text-[15px] sm:text-[16px]">
            {renderCommand(CMD)}
          </code>
          <button
            type="button"
            onClick={copy}
            aria-label="Copy command"
            className="
              inline-flex items-center justify-center
              text-zinc-500 transition-colors
              hover:text-zinc-900
              dark:text-zinc-400 dark:hover:text-zinc-100
            "
          >
            {copied ? (
              <Check size={18} weight="bold" />
            ) : (
              <Copy size={18} weight="regular" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Highlight flags (e.g. -g) in the accent color
function renderCommand(cmd: string) {
  return cmd.split(" ").map((token, i) => {
    const isFlag = /^-{1,2}[A-Za-z]/.test(token);
    return (
      <span key={i}>
        {i > 0 && " "}
        <span
          className={
            isFlag ? "text-[#cc785c] dark:text-[#f97362]" : undefined
          }
        >
          {token}
        </span>
      </span>
    );
  });
}
