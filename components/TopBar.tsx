"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, LogOut, Menu, Settings, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const navLinks = [
  { href: "/", labelKey: "nav.harbor" },
  { href: "/expeditions", labelKey: "nav.expeditions" },
  { href: "/map", labelKey: "nav.map" },
  { href: "/settings", labelKey: "nav.settings" }
];

const labelMap: Record<string, string> = {
  "/": "nav.harbor",
  "/expeditions": "nav.expeditions",
  "/map": "nav.map",
  "/settings": "nav.settings"
};

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const { t } = useTranslation();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const title = useMemo(() => {
    if (!pathname) return "Magellan";
    const direct = labelMap[pathname];
    if (direct) return t(direct);
    if (pathname.startsWith("/expeditions/") && pathname.endsWith("/reflect")) {
      return t("nav.reflect");
    }
    if (pathname.startsWith("/expeditions/")) {
      return t("nav.expedition");
    }
    return t("brand");
  }, [pathname, t]);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) {
        setUser(session?.user ?? null);
      }
    });
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) {
        setUser(session?.user ?? null);
      }
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }, [router, supabase]);

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/5 bg-magellan-smoky/80 px-4 backdrop-blur lg:px-10">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">{t("topbar.openNavigation")}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 border-white/10 bg-magellan-smoky/98">
            <div className="mb-8 flex items-center gap-3 text-lg font-semibold tracking-tight">
              <Compass className="h-5 w-5 text-magellan-glaucous" />
              {t("brand")}
            </div>
            <nav className="flex flex-col gap-2">
              {navLinks.map(({ href, labelKey }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    pathname === href
                      ? "bg-magellan-glaucous/90 text-white shadow"
                      : pathname.startsWith(href) && href !== "/"
                        ? "bg-magellan-glaucous/20 text-white"
                        : "text-white/70 hover:bg-magellan-delft/50 hover:text-white"
                  )}
                >
                  {t(labelKey)}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-magellan-vista/70">
            {t("brand")}
          </p>
          <h1 className="text-lg font-semibold tracking-tight text-white">
            {title}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="gap-2 px-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                  <UserIcon className="h-4 w-4" />
                </div>
                <span className="hidden text-sm font-semibold sm:flex">
                  {user.email ?? t("topbar.guest")}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t("topbar.crewSpace")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t("topbar.settings")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => { void handleLogout(); }}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("topbar.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="rounded-full px-4">
              <Link href="/login">{t("topbar.login")}</Link>
            </Button>
            <Button asChild className="rounded-full px-4">
              <Link href="/signup">{t("topbar.signup")}</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
