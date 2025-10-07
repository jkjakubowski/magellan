"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { tripSchema } from "@/lib/schemas";
import type { Entry, Tag, Trip, TripWithTags } from "@/types/domain";

const entrySchema = z.object({
  trip_id: z.string().uuid(),
  phase: z.enum(["T24", "T72", "T14"] as const),
  payload: z.record(z.any())
});

const shareSchema = z.object({
  trip_id: z.string().uuid(),
  target_email: z.string().email(),
  role: z.enum(["read", "write"] as const),
  expires_at: z.string().optional().nullable()
});

export async function createTrip(form: z.infer<typeof tripSchema>) {
  const supabase = getSupabaseServerClient();
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user.id;
  if (!userId) {
    redirect("/login");
  }

  const parsed = tripSchema.parse(form);
  const { tag_ids, ...rest } = parsed;

  const { data, error } = await supabase
    .from("trips")
    .insert([{ ...rest, user_id: userId }])
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (tag_ids?.length) {
    await attachTagsToTrip(data.id, tag_ids);
  }

  revalidatePath("/expeditions");
  redirect(`/expeditions/${data.id}/reflect`);
}

export async function listTrips(): Promise<TripWithTags[]> {
  const supabase = getSupabaseServerClient();
  const { data: trips, error } = await supabase
    .from("trips")
    .select(
      `
        id,
        user_id,
        created_at,
        date,
        intention,
        substance,
        dose,
        setting,
        safety_flags,
        tags:trip_tags(
          tag:tags(id, name, user_id)
        )
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    trips?.map((trip) => ({
      ...trip,
      tags: (trip.tags ?? []).map((join: any) => join.tag as Tag)
    })) ?? []
  );
}

export async function getTrip(id: string) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("trips")
    .select(
      `
        id,
        user_id,
        created_at,
        date,
        intention,
        substance,
        dose,
        setting,
        safety_flags,
        tags:trip_tags(tag:tags(id, name, user_id)),
        entries:entries(*)
      `
    )
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...data,
    tags: (data.tags ?? []).map((join: any) => join.tag as Tag),
    entries: data.entries as Entry[]
  };
}

export async function updateTrip(id: string, payload: Partial<Trip>) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("trips").update(payload).eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath(`/expeditions/${id}`);
}

export async function deleteTrip(id: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("trips").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/expeditions");
}

export async function upsertEntry(form: z.infer<typeof entrySchema>) {
  const parsed = entrySchema.parse(form);
  const supabase = getSupabaseServerClient();

  const { error } = await supabase.from("entries").upsert(
    {
      trip_id: parsed.trip_id,
      phase: parsed.phase,
      mood_scores: parsed.payload.mood_scores ?? {},
      body_notes: parsed.payload.body_notes ?? null,
      key_images: parsed.payload.key_images ?? [],
      insights: parsed.payload.insights ?? null,
      action_next: parsed.payload.action_next ?? null,
      alignment_score: parsed.payload.alignment_score ?? null
    },
    {
      onConflict: "trip_id,phase"
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/expeditions/${parsed.trip_id}`);
}

export async function listTags(): Promise<Tag[]> {
  const supabase = getSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return [];
  }

  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("name", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }

  if (data && data.length > 0) {
    return data as Tag[];
  }

  await supabase.rpc("seed_default_tags", { target_user: session.user.id });

  const { data: seeded, error: seededError } = await supabase
    .from("tags")
    .select("*")
    .order("name", { ascending: true });

  if (seededError) {
    throw new Error(seededError.message);
  }

  return (seeded ?? []) as Tag[];
}

export async function upsertTag(name: string): Promise<Tag> {
  const supabase = getSupabaseServerClient();
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user.id;
  if (!userId) {
    throw new Error("Utilisateur non authentifié.");
  }

  const { data, error } = await supabase
    .from("tags")
    .upsert({ name, user_id: userId })
    .select("*")
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data as Tag;
}

export async function attachTagsToTrip(tripId: string, tagIds: string[]) {
  if (!tagIds.length) return;
  const supabase = getSupabaseServerClient();
  const rows = tagIds.map((tagId) => ({ trip_id: tripId, tag_id: tagId }));
  const { error } = await supabase.from("trip_tags").upsert(rows, {
    onConflict: "trip_id,tag_id"
  });
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath(`/expeditions/${tripId}`);
}

export async function createShare(form: z.infer<typeof shareSchema>) {
  const parsed = shareSchema.parse(form);
  const supabase = getSupabaseServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .ilike("email", parsed.target_email)
    .single();

  const session = await supabase.auth.getSession();
  const ownerId = session.data.session?.user.id;
  if (!ownerId) {
    throw new Error("Utilisateur non authentifié.");
  }

  const { error } = await supabase.from("shares").insert({
    trip_id: parsed.trip_id,
    owner_id: ownerId,
    target_user_id: profile?.id ?? null,
    role: parsed.role,
    expires_at: parsed.expires_at ?? null
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/expeditions/${parsed.trip_id}`);
  return { success: true };
}

export async function listShares() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("shares")
    .select(
      `
        id,
        trip_id,
        owner_id,
        target_user_id,
        role,
        expires_at,
        created_at,
        trip:trips(id,intention)
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
