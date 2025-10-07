import { Suspense } from "react";
import { listTrips } from "@/lib/actions";
import { TripCard } from "@/components/TripCard";
import PDFButton from "@/components/PDFButton";
import { getServerTranslation } from "@/lib/i18n/server";
import type { TFunction } from "i18next";

interface DashboardContentProps {
  t: TFunction;
  locale: string;
}

async function DashboardContent({ t, locale }: DashboardContentProps) {
  try {
    const trips = await listTrips();
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            tags={trip.tags}
            href={`/expeditions/${trip.id}`}
            subtitle={t("expeditions.lastUpdate")}
            t={t}
            locale={locale}
          />
        ))}
        {trips.length === 0 && (
          <div className="glass-card p-10 text-white/70">
            <h2 className="text-xl font-semibold text-white">
              {t("dashboard.emptyTitle")}
            </h2>
            <p className="mt-2 text-sm text-white/70">
              {t("dashboard.emptyDescription")}
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="glass-card p-10 text-sm text-rose-200">
        {t("dashboard.error")}
      </div>
    );
  }
}

export default async function Page() {
  const { t, locale } = await getServerTranslation();

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-magellan-delft/60 p-8 shadow-lg backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.3em] text-magellan-vista/70">
              {t("nav.harbor")}
            </p>
            <h2 className="text-2xl font-semibold text-white">
              {t("dashboard.heroTitle")}
            </h2>
            <p className="max-w-2xl text-sm text-white/70">
              {t("dashboard.heroDescription")}
            </p>
          </div>
          <PDFButton />
        </div>
      </section>
      <Suspense fallback={<div className="text-white/50">{t("dashboard.loading")}</div>}>
        <DashboardContent t={t} locale={locale} />
      </Suspense>
    </div>
  );
}
