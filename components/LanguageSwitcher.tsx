"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { languages, type AppLanguage } from "@/lib/i18n/settings";

const FLAGS: Record<AppLanguage, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  de: "🇩🇪"
};

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = (i18n.language?.split("-")[0] as AppLanguage) ?? "fr";
  const router = useRouter();

  const changeLanguage = useCallback(
    async (lng: AppLanguage) => {
      await i18n.changeLanguage(lng);
      window.localStorage.setItem("magellan-lang", lng);
      document.cookie = `i18next=${lng}; path=/; max-age=31536000`;
      document.documentElement.lang = lng;
      router.refresh();
    },
    [i18n, router]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-12 rounded-full text-lg"
          aria-label={t("languageSwitcher.label")}
        >
          {FLAGS[current]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {languages.map((lng) => (
          <DropdownMenuItem
            key={lng}
            onSelect={() => {
              void changeLanguage(lng);
            }}
            className="flex items-center justify-between"
          >
            <span>{t(`language.${lng}`)}</span>
            <span className="text-lg">{FLAGS[lng]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
