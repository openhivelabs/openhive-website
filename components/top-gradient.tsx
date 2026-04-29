"use client";

import { usePathname } from "next/navigation";

export function TopGradient() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[420px] dark:hidden"
      style={{
        background:
          "linear-gradient(180deg, #fef3c7 0%, #fffaeb 35%, transparent 100%)",
      }}
    />
  );
}
