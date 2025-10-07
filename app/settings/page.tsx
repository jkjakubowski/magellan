import { listShares, listTrips } from "@/lib/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import CrewForm from "./CrewForm";
import { Badge } from "@/components/ui/badge";
import { getServerTranslation } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [trips, shares] = await Promise.all([
    listTrips().catch(() => []),
    listShares().catch(() => [])
  ]);
  const { t } = await getServerTranslation();

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-magellan-vista/70">
          {t("nav.settings")}
        </p>
        <h1 className="text-3xl font-semibold text-white">
          {t("settings.title")}
        </h1>
        <p className="text-sm text-white/70">{t("settings.description")}</p>
      </header>
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.preferencesTitle")}</CardTitle>
            <CardDescription>{t("settings.preferencesDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm text-white/70">
            <div>
              <p className="font-semibold text-white">
                {t("settings.languageLabel")}
              </p>
              <p className="text-white/60">{t("settings.languageValue")}</p>
            </div>
            <div>
              <p className="font-semibold text-white">
                {t("settings.remindersLabel")}
              </p>
              <p className="text-white/60">{t("settings.remindersValue")}</p>
            </div>
            <div>
              <p className="font-semibold text-white">
                {t("settings.immersiveLabel")}
              </p>
              <p className="text-white/60">{t("settings.immersiveValue")}</p>
            </div>
          </CardContent>
        </Card>
        <Card id="partage">
          <CardHeader>
            <CardTitle>{t("settings.shareTitle")}</CardTitle>
            <CardDescription>{t("settings.shareDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <CrewForm trips={trips} />
            <div className="mt-6 flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                {t("settings.activeInvites")}
              </p>
              {shares.length > 0 ? (
                shares.map((share: any) => (
                  <div
                    key={share.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">
                        {share.trip?.intention ?? t("nav.expedition")}
                      </span>
                      <span>
                        {share.target_user_id
                          ? t("settings.sharedMember")
                          : t("settings.sharedPending")}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-white/15 text-xs text-white/60"
                    >
                      {share.role === "write"
                        ? t("crew.roleWrite")
                        : t("crew.roleRead")}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/60">
                  {t("settings.noShares")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
