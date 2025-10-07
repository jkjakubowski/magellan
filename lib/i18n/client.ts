"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { resources } from "@/lib/i18n/resources";
import { defaultNS, fallbackLng, languages } from "@/lib/i18n/settings";

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng,
      supportedLngs: languages,
      defaultNS,
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "magellan-lang"
      },
      interpolation: {
        escapeValue: false
      }
    });
}

export default i18n;
