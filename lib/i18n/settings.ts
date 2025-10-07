export const fallbackLng = "fr" as const;
export const languages = ["fr", "en", "de"] as const;
export const defaultNS = "common" as const;

export type AppLanguage = (typeof languages)[number];
