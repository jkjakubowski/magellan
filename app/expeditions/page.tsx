import Link from "next/link";
import { listTags, listTrips } from "@/lib/actions";
import { TripCard } from "@/components/TripCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getServerTranslation } from "@/lib/i18n/server";
import type { TFunction } from "i18next";

export const dynamic = "force-dynamic";

function EmptyState({ t }: { t: TFunction }) {
  return (
    <div className="glass-card p-10 text-white/60">
      <h2 className="text-xl font-semibold text-white">
        {t("expeditions.emptyTitle")}
      </h2>
      <p className="mt-2 text-sm">
        {t("expeditions.emptyDescription")}
      </p>
      <Button asChild className="mt-6">
        <Link href="/expeditions/new">{t("buttons.newExpedition")}</Link>
      </Button>
    </div>
  );
}

interface ExpeditionListProps {
  trips: Awaited<ReturnType<typeof listTrips>>;
  tags: Awaited<ReturnType<typeof listTags>>;
  t: TFunction;
  locale: string;
}

function ExpeditionList({ trips, tags, t, locale }: ExpeditionListProps) {
  if (!trips.length) {
    return <EmptyState t={t} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
          {t("expeditions.filterTitle")}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              className="border-white/15 text-xs text-white/70"
            >
              #{tag.name}
            </Badge>
          ))}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            tags={trip.tags}
            href={`/expeditions/${trip.id}`}
            t={t}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}

export default async function ExpeditionsPage() {
  const [trips, tags] = await Promise.all([
    listTrips(),
    listTags().catch(() => [])
  ]);
  const { t, locale } = await getServerTranslation();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-magellan-vista/70">
            {t("nav.expeditions")}
          </p>
          <h1 className="text-2xl font-semibold text-white">
            {t("expeditions.title")}
          </h1>
        </div>
        <Button asChild>
          <Link href="/expeditions/new">{t("buttons.newExpedition")}</Link>
        </Button>
      </div>
      <ExpeditionList trips={trips} tags={tags} t={t} locale={locale} />
    </div>
  );
}
