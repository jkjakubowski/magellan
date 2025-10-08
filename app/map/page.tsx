import { listTags, listTrips } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { getServerTranslation } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const [tags, trips] = await Promise.all([
    listTags().catch(() => []),
    listTrips().catch(() => [])
  ]);
  const { t } = await getServerTranslation();

  const occurrences = tags.map((tag) => {
    const count = trips.filter((trip) =>
      trip.tags.some((tripTag) => tripTag.id === tag.id)
    ).length;
    return { tag, count };
  });

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-magellan-vista/70">
          {t("nav.map")}
        </p>
        <h1 className="text-3xl font-semibold text-white">
          {t("map.title")}
        </h1>
        <p className="max-w-2xl text-sm text-white/70">
          {t("map.description")}
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>{t("map.motifsTitle")}</CardTitle>
          <CardDescription>{t("map.motifsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {occurrences.length > 0 ? (
            occurrences
              .sort((a, b) => b.count - a.count)
              .map(({ tag, count }) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="bg-magellan-delft/80 text-sm"
                >
                  #{tag.name} · {count}
                </Badge>
              ))
          ) : (
            <p className="text-sm text-white/60">{t("map.empty")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
