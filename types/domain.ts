export type Phase = "T24" | "T72" | "T14";

export interface Profile {
  id: string;
  created_at: string;
  email?: string | null;
}

export interface Trip {
  id: string;
  user_id: string;
  created_at: string;
  date: string | null;
  intention: string;
  substance?: string | null;
  dose?: string | null;
  setting?: string | null;
  safety_flags: string[];
}

export interface Entry {
  id: string;
  trip_id: string;
  created_at: string;
  phase: Phase;
  mood_scores: {
    energy?: number;
    calm?: number;
    joy?: number;
    fear?: number;
    sadness?: number;
    awe?: number;
  };
  body_notes?: string | null;
  key_images: string[];
  insights?: string | null;
  action_next?: string | null;
  alignment_score?: number | null;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
}

export interface TripTag {
  trip_id: string;
  tag_id: string;
}

export type TripWithTags = Trip & { tags: Tag[] };

export interface Share {
  id: string;
  trip_id: string;
  owner_id: string;
  target_user_id: string | null;
  role: "read" | "write";
  expires_at: string | null;
}
