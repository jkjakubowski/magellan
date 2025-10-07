import { cookies, headers } from "next/headers";
import { createInstance } from "i18next";
import { resources } from "@/lib/i18n/resources";
import { AppLanguage, defaultNS, fallbackLng, languages } from "@/lib/i18n/settings";

const COOKIE_NAME = "i18next";

export function detectLocale(): AppLanguage {
  const cookie = cookies().get(COOKIE_NAME)?.value as AppLanguage | undefined;
  if (cookie && languages.includes(cookie)) {
    return cookie;
  }

  const accept = headers().get("accept-language");
  if (accept) {
    const accepted = accept
      .split(",")
      .map((part) => part.split(";")[0]?.trim())
      .filter(Boolean);
    for (const lang of accepted) {
      const base = lang?.split("-")[0] as AppLanguage | undefined;
      if (base && languages.includes(base)) {
        return base;
      }
    }
  }

  return fallbackLng;
}

export async function getServerTranslation(
  locale: AppLanguage = detectLocale(),
  ns: string | string[] = defaultNS
) {
  const instance = createInstance();
  await instance.init({
    resources,
    lng: locale,
    fallbackLng,
    supportedLngs: languages,
    defaultNS,
    ns,
    interpolation: {
      escapeValue: false
    }
  });

  return {
    t: instance.getFixedT(locale, ns),
    locale
  };
}
