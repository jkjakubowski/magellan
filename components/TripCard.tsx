import Link from "next/link";
import { Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { Trip, Tag, TripWithTags } from "@/types/domain";
import { cn } from "@/lib/utils";
import type { TFunction } from "i18next";

interface TripCardProps {
  trip: Trip | TripWithTags;
  tags?: Tag[];
  href?: string;
  subtitle?: string;
  t: TFunction;
  locale: string;
}

export function TripCard({
  trip,
  tags = [],
  href = "#",
  subtitle,
  t,
  locale
}: TripCardProps) {
  const dateLabel = trip.date
    ? new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(trip.date))
    : t("common.dateFallback");

  return (
    <Link
      href={href}
      className="transition hover:scale-[1.01] hover:brightness-110"
    >
      <Card className="glass-card h-full">
        <CardHeader>
          <CardTitle className="flex flex-col gap-2 text-lg sm:flex-row sm:items-center sm:justify-between">
            <span>{trip.intention}</span>
            <Compass className="h-4 w-4 text-magellan-vista" />
          </CardTitle>
          <CardDescription className="text-white/70">
            {subtitle ?? dateLabel}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-white/70">
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-white/40">
            <span>{trip.substance ?? t("common.substanceFallback")}</span>
            <span>{trip.dose ?? t("common.doseFallback")}</span>
          </div>
          <p className="text-sm leading-relaxed text-white/80">
            {trip.setting ?? t("common.settingFallback")}
          </p>
          {trip.safety_flags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {trip.safety_flags.map((flag) => (
                <Badge
                  key={flag}
                  variant="outline"
                  className="border-magellan-vista/30 text-xs text-magellan-vista"
                >
                  {flag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className={cn("bg-magellan-delft/80 text-xs text-white/80")}
              >
                {tag.name}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-white/40">{t("common.noTags")}</span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
