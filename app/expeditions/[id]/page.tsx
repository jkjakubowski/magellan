import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Share2, Sparkles } from "lucide-react";
import { getTrip } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PDFButton from "@/components/PDFButton";
import { getServerTranslation } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function ExpeditionPage({ params }: Props) {
  const trip = await getTrip(params.id).catch(() => null);
  if (!trip) {
    notFound();
  }

  const { t, locale } = await getServerTranslation();

  const dateLabel = trip.date
    ? new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(trip.date))
    : t("common.dateFallback");

  const t24Entry = trip.entries.find((entry) => entry.phase === "T24");
  const t72Entry = trip.entries.find((entry) => entry.phase === "T72");
  const t14Entry = trip.entries.find((entry) => entry.phase === "T14");
  const hasCompletedT24 = Boolean(
    t24Entry &&
      (t24Entry.insights ||
        t24Entry.body_notes ||
        t24Entry.key_images?.length ||
        t24Entry.action_next)
  );

  return (
    <div className="flex flex-col gap-10">
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="rounded-3xl border border-white/10 bg-magellan-delft/50 shadow-lg backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">{trip.intention}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm text-white/70">
              <Calendar className="h-4 w-4 text-magellan-vista" />
              {dateLabel}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 text-sm text-white/70">
            <div className="flex flex-wrap gap-4 text-xs uppercase tracking-wide text-white/40">
              <span>{trip.substance ?? t("common.substanceFallback")}</span>
              <span>{trip.dose ?? t("common.doseFallback")}</span>
            </div>
            <p className="flex items-center gap-2 text-sm text-white/80">
              <MapPin className="h-4 w-4 text-magellan-vista" />
              {trip.setting ?? t("common.settingFallback")}
            </p>
            {trip.safety_flags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {trip.safety_flags.map((flag: string) => (
                  <Badge
                    key={flag}
                    variant="outline"
                    className="border-magellan-vista/40 text-xs text-magellan-vista"
                  >
                    {flag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {trip.tags.length > 0 ? (
                trip.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    #{tag.name}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-white/40">
                  {t("common.noTags")}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border border-magellan-vista/20 bg-magellan-delft/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Share2 className="h-5 w-5 text-magellan-vista" />
              {t("trip.shareTitle")}
            </CardTitle>
            <CardDescription>{t("trip.shareDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild variant="outline" className="justify-center">
              <Link href={`/settings#partage`}>{t("buttons.manageSharing")}</Link>
            </Button>
            <PDFButton />
          </CardContent>
        </Card>
      </section>
      <Tabs defaultValue="journal" className="space-y-6">
        <TabsList className="flex  w-fit  flex-wrap gap-2">
          <TabsTrigger className="flex-1 min-w-[140px] sm:flex-initial" value="journal">
            {t("trip.tabJournal")}
          </TabsTrigger>
          <TabsTrigger className="flex-1 min-w-[140px] sm:flex-initial" value="t72">
            {t("trip.tabT72")}
          </TabsTrigger>
          <TabsTrigger className="flex-1 min-w-[140px] sm:flex-initial" value="t14">
            {t("trip.tabT14")}
          </TabsTrigger>
          <TabsTrigger className="flex-1 min-w-[140px] sm:flex-initial" value="exports">
            {t("trip.tabExports")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="journal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-magellan-vista" />
                {t("trip.journalTitle")}
              </CardTitle>
              <CardDescription>{t("trip.journalDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm text-white/70">
              {t24Entry ? (
                <>
                  <p>{t24Entry.insights ?? t("trip.journalPlaceholder")}</p>
                  <div className="flex flex-wrap gap-2">
                    {t24Entry.key_images.map((image) => (
                      <Badge key={image} variant="outline">
                        {image}
                      </Badge>
                    ))}
                  </div>
                </>
              ) : (
                <p>{t("trip.emptyJournal")}</p>
              )}
              <Button asChild>
                <Link href={`/expeditions/${trip.id}/reflect`}>
                  {t("buttons.continueJournal")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="t72" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("trip.t72Title")}</CardTitle>
              <CardDescription>{t("trip.t72Description")}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-white/70">
              {t72Entry ? (
                <div className="flex flex-col gap-3">
                  <p>{t72Entry.insights ?? t("trip.t72NotesEmpty")}</p>
                  <p>{t72Entry.body_notes}</p>
                  <p>
                    {t("trip.actionLabel")}:{" "}
                    {t72Entry.action_next ?? t("trip.undefined")}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <p>{t("trip.t72Description")}</p>
                  {hasCompletedT24 ? (
                    <Button
                      asChild
                      size="sm"
                      variant="secondary"
                      className="w-fit"
                    >
                      <Link href={`/expeditions/${trip.id}/reflect?phase=T72`}>
                        {t("trip.startT72")}
                      </Link>
                    </Button>
                  ) : (
                    <span>{t("trip.t72Empty")}</span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="t14" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("trip.t14Title")}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/70">
              {t14Entry ? (
                <div className="flex flex-col gap-3">
                  <p>{t14Entry.body_notes ?? t("trip.t14BodyFallback")}</p>
                  <p>{t14Entry.insights ?? ""}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <p>{t("trip.t14Empty")}</p>
                  {hasCompletedT24 && (
                    <Button
                      asChild
                      size="sm"
                      variant="secondary"
                      className="w-fit"
                    >
                      <Link href={`/expeditions/${trip.id}/reflect?phase=T14`}>
                        {t("trip.startT14")}
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="exports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("trip.exportsTitle")}</CardTitle>
              <CardDescription>{t("trip.exportsDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm text-white/70">
              <PDFButton />
              <Button asChild variant="outline">
                <Link href={`/settings#partage`}>
                  {t("buttons.manageSharing")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
