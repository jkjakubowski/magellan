"use client";

import { ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n/client";

interface I18nProviderProps {
  locale: string;
  children: ReactNode;
}

export function I18nProvider({ locale, children }: I18nProviderProps) {
  if (locale && i18n.resolvedLanguage !== locale) {
    i18n.changeLanguage(locale);
  }

  useEffect(() => {
    if (locale && i18n.language !== locale) {
      void i18n.changeLanguage(locale);
      window.localStorage.setItem("magellan-lang", locale);
      document.documentElement.lang = locale;
      document.cookie = `i18next=${locale}; path=/; max-age=31536000`;
    }
  }, [locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
