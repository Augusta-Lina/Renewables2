"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Forecasts" },
  { href: "/variables", label: "Variables" },
  { href: "/algorithms", label: "Algorithms" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b-2 border-bark" style={{ backgroundColor: "#110702" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Link href="/" className="font-serif text-lg" style={{ color: "#8b6c5c" }}>
          Spain Electricity Forecasting
        </Link>
        <nav className="flex gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-white/15 text-white"
                  : "text-sand-mid hover:text-sand-light hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
