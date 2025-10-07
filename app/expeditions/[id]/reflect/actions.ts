"use server";

import { upsertEntry } from "@/lib/actions";

type Phase = "T24" | "T72" | "T14";

function buildPayload(phase: Phase, values: Record<string, any>) {
  if (phase === "T24") {
    return {
      mood_scores: values.mood ?? {},
      key_images: values.key_images ?? [],
      body_notes: values.body_notes ?? null,
      insights: values.insights ?? null,
      action_next: values.action_next ?? null,
      alignment_score: values.alignment_score ?? null
    };
  }
  if (phase === "T72") {
    return {
      mood_scores: values.alignment_score ?? {},
      key_images: values.key_images ?? [],
      body_notes: values.contradictions ?? null,
      insights: values.integration ?? null,
      action_next: values.action_smart ?? null,
      alignment_score: values.alignment_score?.alignement ?? null
    };
  }
  return {
    mood_scores: values.alignment_long ?? {},
    key_images: values.key_images ?? [],
    body_notes: values.trace ?? null,
    insights: values.therapy_question ?? null,
    action_next: values.closing ?? null,
    alignment_score: values.alignment_long?.long_alignment ?? null
  };
}

export async function persistReflection(
  tripId: string,
  phase: Phase,
  values: Record<string, any>
) {
  await upsertEntry({
    trip_id: tripId,
    phase,
    payload: buildPayload(phase, values)
  });
}
