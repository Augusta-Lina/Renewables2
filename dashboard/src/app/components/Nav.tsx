"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Feature Importance" },
  { href: "/forecasts", label: "DeepAR Forecasts" },
  { href: "/tft-forecasts", label: "TFT Forecasts" },
  { href: "/patchtst-forecasts", label: "PatchTST" },
  { href: "/stacking-forecasts", label: "Stacking" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 bg-gray-900 rounded-lg p-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            pathname === link.href
              ? "bg-gray-700 text-white"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
