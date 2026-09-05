import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type PublicReview = {
  id: string;
  name: string;
  rating: number;
  body: string;
  created_at: string;
};

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const listApprovedReviews = createServerFn({ method: "GET" }).handler(async () => {
  const db = await admin();
  const { data, error } = await db
    .from("reviews")
    .select("id, name, rating, body, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(24);
  if (error) throw new Error(error.message);
  return (data ?? []) as PublicReview[];
});

const reviewSchema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(80),
  rating: z.number().int().min(1).max(5),
  body: z.string().trim().min(5, "Please write a short review").max(1200),
});

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => reviewSchema.parse(input))
  .handler(async ({ data }) => {
    const db = await admin();
    const { error } = await db
      .from("reviews")
      .insert({ name: data.name, rating: data.rating, body: data.body, status: "pending" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const enquirySchema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(80),
  phone: z.string().trim().min(6, "Please add a phone number").max(30),
  email: z.string().trim().email("Please add a valid email").max(160).or(z.literal("")),
  service: z.string().trim().max(80).optional().default(""),
  preferred_date: z.string().trim().max(40).optional().default(""),
  preferred_time: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().max(1500).optional().default(""),
});

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => enquirySchema.parse(input))
  .handler(async ({ data }) => {
    const db = await admin();
    const { error } = await db.from("enquiries").insert({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      service: data.service || null,
      preferred_date: data.preferred_date || null,
      preferred_time: data.preferred_time || null,
      message: data.message || null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export type GalleryPhoto = { id: string; url: string; caption: string | null };

export const listGalleryPhotos = createServerFn({ method: "GET" }).handler(async () => {
  const db = await admin();
  const { data, error } = await db
    .from("photos")
    .select("id, url, caption, sort")
    .order("sort", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(24);
  if (error) throw new Error(error.message);

  const rows = data ?? [];
  const out: GalleryPhoto[] = [];
  for (const row of rows) {
    let url = row.url as string;
    if (!url.startsWith("http")) {
      const signed = await db.storage.from("site-photos").createSignedUrl(url, 60 * 60 * 24 * 7);
      if (!signed.data?.signedUrl) continue;
      url = signed.data.signedUrl;
    }
    out.push({ id: row.id as string, url, caption: (row.caption as string | null) ?? null });
  }
  return out;
});
