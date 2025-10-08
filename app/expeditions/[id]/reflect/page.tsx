import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTrip } from "@/lib/actions";
import { T24_STEPS, T72_STEPS, T14_STEPS } from "@/config/forms";
import ReflectForm from "./ReflectForm";
import { getServerTranslation } from "@/lib/i18n/server";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type Phase = "T24" | "T72" | "T14";

interface Props {
  params: { id: string };
  searchParams: { phase?: Phase };
}

export default async function ReflectPage({ params, searchParams }: Props) {
  const trip = await getTrip(params.id).catch(() => null);
  if (!trip) {
    notFound();
  }

  const allowedPhases: Phase[] = ["T24", "T72", "T14"];
  const phase: Phase = allowedPhases.includes(searchParams.phase as Phase)
    ? (searchParams.phase as Phase)
    : "T24";

  const { t } = await getServerTranslation();

  const entry = (trip.entries ?? []).find((item) => item.phase === phase);

  let initialValues: Record<string, any> = {};

  if (phase === "T24") {
    initialValues = entry
      ? {
          mood: entry.mood_scores ?? {},
          key_images: entry.key_images ?? [],
          insights: entry.insights ?? "",
          body_notes: entry.body_notes ?? "",
          action_next: entry.action_next ?? "",
          alignment_score: entry.alignment_score ?? null
        }
      : {};
  } else if (phase === "T72") {
    initialValues = entry
      ? {
          contradictions: entry.body_notes ?? "",
          integration: entry.insights ?? "",
          action_smart: entry.action_next ?? "",
          alignment_score:
            Object.keys(entry.mood_scores ?? {}).length > 0
              ? entry.mood_scores
              : { alignement: entry.alignment_score ?? 0 }
        }
      : {
          contradictions: "",
          integration: "",
          action_smart: "",
          alignment_score: { alignement: 0 }
        };
  } else {
    initialValues = entry
      ? {
          trace: entry.body_notes ?? "",
          alignment_long:
            Object.keys(entry.mood_scores ?? {}).length > 0
              ? entry.mood_scores
              : { long_alignment: entry.alignment_score ?? 0 },
          therapy_question: entry.insights ?? "",
          closing: entry.action_next ?? ""
        }
      : {
          trace: "",
          alignment_long: { long_alignment: 0 },
          therapy_question: "",
          closing: ""
        };
  }

  const stepsMap: Record<Phase, typeof T24_STEPS> = {
    T24: T24_STEPS,
    T72: T72_STEPS,
    T14: T14_STEPS
  };

  const phaseLabel =
    phase === "T24"
      ? t("reflect.title")
      : phase === "T72"
        ? t("trip.t72Title")
        : t("trip.t14Title");

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
      <header className="flex flex-col gap-2">
      <Button
            asChild
            variant="ghost"
            className="inline-flex self-start items-center gap-2 text-sm text-white/70 hover:text-white"
          >
            <Link href={`/expeditions/${trip.id}`}>
              <ArrowLeft className="h-4 w-4" />
              {t("buttons.back")}
            </Link>
          </Button>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <p className="text-xs uppercase tracking-[0.3em] text-magellan-vista/70">
              {phaseLabel}
            </p>
            <h1 className="text-3xl font-semibold text-white">
              {trip.intention}
            </h1>
          </div>
          
        </div>
        <p className="text-sm text-white/70">{t("reflect.subtitle")}</p>
      </header>
      <ReflectForm
        tripId={trip.id}
        initialValues={initialValues}
        steps={stepsMap[phase]}
        phaseLabel={phaseLabel}
        phase={phase}
      />
    </div>
  );
}
