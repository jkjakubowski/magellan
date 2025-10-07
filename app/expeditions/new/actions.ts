"use server";

import { createTrip, upsertTag } from "@/lib/actions";
import { tripSchema } from "@/lib/schemas";

export async function submitExpedition(_: any, formData: FormData) {
  const tags = formData.getAll("tags") as string[];
  const payload = {
    intention: String(formData.get("intention") ?? ""),
    date: (() => {
      const date = formData.get("date") as string | null;
      const time = formData.get("time") as string | null;
      if (!date) return null;
      if (!time) return date;
      return `${date}T${time}:00`;
    })(),
    substance: (formData.get("substance") as string | null) ?? undefined,
    dose: (formData.get("dose") as string | null) ?? undefined,
    setting: (formData.get("setting") as string | null) ?? undefined,
    safety_flags: (formData.get("safety_flags") as string | null)
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    tag_ids: tags
  };

  const parsed = tripSchema.parse(payload);
  await createTrip(parsed);
}

export async function createTagAction(name: string) {
  return upsertTag(name);
}
