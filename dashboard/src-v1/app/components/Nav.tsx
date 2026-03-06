"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Feature Importance" },
  { href: "/forecasts", label: "DeepAR" },
  { href: "/tft-forecasts", label: "TFT" },
  { href: "/patchtst-forecasts", label: "PatchTST" },
  { href: "/stacking-forecasts", label: "Stacking" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative">
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden flex items-center gap-2 bg-sand-light border-2 border-bark rounded-lg px-4 py-2 text-sm font-medium"
        aria-label="Toggle navigation"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
        {links.find((l) => l.href === pathname)?.label || "Menu"}
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden absolute top-12 left-0 right-0 z-50 bg-sand-light border-2 border-bark rounded-lg p-2 flex flex-col gap-1 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-bark text-sand-light"
                  : "text-bark-light hover:bg-sand-pale"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Desktop tabs */}
      <div className="hidden sm:flex gap-1 bg-sand-light border-2 border-bark rounded-lg p-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === link.href
                ? "bg-bark text-sand-light"
                : "text-bark-light hover:bg-sand-pale"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
