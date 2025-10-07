"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, LayoutDashboard, Map, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const links = [
  { href: "/", labelKey: "nav.harbor", icon: LayoutDashboard },
  { href: "/expeditions", labelKey: "nav.expeditions", icon: Compass },
  { href: "/map", labelKey: "nav.map", icon: Map },
  { href: "/settings", labelKey: "nav.settings", icon: Settings }
];

export default function SideNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-white/5 bg-magellan-smoky/60 px-5 py-8 lg:flex lg:sticky lg:top-0">
      <div className="mb-10 flex items-center gap-3 text-xl font-semibold tracking-tight">
        <Compass className="h-6 w-6 text-magellan-glaucous" />
        {t("brand")}
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {links.map(({ href, labelKey, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                active
                  ? "bg-magellan-glaucous/90 text-white shadow"
                  : "text-white/70 hover:bg-magellan-delft/50 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {t(labelKey)}
            </Link>
          );
        })}
      </nav>
      <p className="mt-6 text-xs text-white/40">
        {t("nav.tagline")}
      </p>
    </aside>
  );
}
