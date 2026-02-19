"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home", icon: "⚡" },
  { href: "/features", label: "Feature Importance", icon: "📊" },
  { href: "/generation", label: "Generation", icon: "☀️" },
  { href: "/demand", label: "Demand", icon: "🏭" },
  { href: "/price", label: "Price", icon: "💶" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-gray-950 border-r border-gray-800 flex flex-col z-50">
      <div className="px-6 py-6">
        <h1 className="text-lg font-bold text-white tracking-tight">
          Spain Electricity
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">Forecasting 2015–2018</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-900"
              }`}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-gray-800">
        <p className="text-xs text-gray-600">
          Stacking Ensemble model
          <br />
          XGB + LGBM + Ridge + RF
        </p>
      </div>
    </aside>
  );
}
