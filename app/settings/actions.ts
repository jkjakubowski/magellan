"use server";

import { createShare } from "@/lib/actions";

export type InviteState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export const inviteInitialState: InviteState = { status: "idle" };

export async function inviteCrew(_: InviteState, formData: FormData): Promise<InviteState> {
  const tripId = formData.get("trip_id") as string;
  const target_email = String(formData.get("email") ?? "");
  const role = (formData.get("role") as "read" | "write") ?? "read";

  try {
    await createShare({
      trip_id: tripId,
      target_email,
      role,
      expires_at: null
    });
    return { status: "success" };
  } catch (error) {
    return { status: "error", message: (error as Error).message };
  }
}
