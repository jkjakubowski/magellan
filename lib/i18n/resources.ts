import fr from "@/locales/fr/common.json";
import en from "@/locales/en/common.json";
import de from "@/locales/de/common.json";

export const resources = {
  fr: {
    common: fr
  },
  en: {
    common: en
  },
  de: {
    common: de
  }
} as const;

export type I18nResources = typeof resources;
