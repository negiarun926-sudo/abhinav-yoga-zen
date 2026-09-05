import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

async function db() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function gate(token: string) {
  const { requireAdmin } = await import("./admin-session.server");
  await requireAdmin(token);
}

const tokenInput = z.object({ token: z.string().min(1) });

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ username: z.string().max(120), password: z.string().max(200) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { checkCredentials, createAdminToken } = await import("./admin-session.server");
    if (!checkCredentials(data.username, data.password)) {
      return { ok: false as const, token: null };
    }
    return { ok: true as const, token: await createAdminToken() };
  });

export const adminVerify = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => tokenInput.parse(input))
  .handler(async ({ data }) => {
    const { verifyAdminToken } = await import("./admin-session.server");
    return { ok: await verifyAdminToken(data.token) };
  });

/* ---------------- Reviews ---------------- */

export const adminListReviews = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => tokenInput.parse(input))
  .handler(async ({ data }) => {
    await gate(data.token);
    const { data: rows, error } = await (await db())
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminSetReviewStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    tokenInput
      .extend({ id: z.string().uuid(), status: z.enum(["approved", "rejected", "pending"]) })
      .parse(input),
  )
  .handler(async ({ data }) => {
    await gate(data.token);
    const { error } = await (await db())
      .from("reviews")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteReview = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => tokenInput.extend({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    await gate(data.token);
    const { error } = await (await db()).from("reviews").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------- Enquiries ---------------- */

export const adminListEnquiries = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => tokenInput.parse(input))
  .handler(async ({ data }) => {
    await gate(data.token);
    const { data: rows, error } = await (await db())
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminDeleteEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => tokenInput.extend({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    await gate(data.token);
    const { error } = await (await db()).from("enquiries").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------- Pricing ---------------- */

export const adminListPricing = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => tokenInput.parse(input))
  .handler(async ({ data }) => {
    await gate(data.token);
    const { data: rows, error } = await (await db())
      .from("pricing")
      .select("*")
      .order("sort", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

const pricingFields = z.object({
  class_name: z.string().trim().min(1).max(120),
  package_name: z.string().trim().max(120).optional().default(""),
  price: z.string().trim().max(60).optional().default(""),
  duration: z.string().trim().max(60).optional().default(""),
  description: z.string().trim().max(600).optional().default(""),
  active: z.boolean().optional().default(true),
});

export const adminSavePricing = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    tokenInput.extend({ id: z.string().uuid().nullable(), values: pricingFields }).parse(input),
  )
  .handler(async ({ data }) => {
    await gate(data.token);
    const client = await db();
    if (data.id) {
      const { error } = await client.from("pricing").update(data.values).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await client.from("pricing").insert(data.values);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminDeletePricing = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => tokenInput.extend({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    await gate(data.token);
    const { error } = await (await db()).from("pricing").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------- Photos ---------------- */

export const adminListPhotos = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => tokenInput.parse(input))
  .handler(async ({ data }) => {
    await gate(data.token);
    const client = await db();
    const { data: rows, error } = await client
      .from("photos")
      .select("*")
      .order("sort", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const out = [];
    for (const row of rows ?? []) {
      let preview = row.url as string;
      if (!preview.startsWith("http")) {
        const signed = await client.storage
          .from("site-photos")
          .createSignedUrl(preview, 60 * 60 * 6);
        preview = signed.data?.signedUrl ?? "";
      }
      out.push({ ...row, preview });
    }
    return out;
  });

export const adminUploadPhoto = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    tokenInput
      .extend({
        filename: z.string().min(1).max(200),
        contentType: z.string().min(1).max(100),
        dataBase64: z.string().min(1),
        section: z.string().max(60).optional().default("gallery"),
        caption: z.string().max(200).optional().default(""),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    await gate(data.token);
    const client = await db();
    const binary = atob(data.dataBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const safe = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${crypto.randomUUID()}-${safe}`;
    const upload = await client.storage
      .from("site-photos")
      .upload(path, bytes, { contentType: data.contentType, upsert: false });
    if (upload.error) throw new Error(upload.error.message);
    const { error } = await client
      .from("photos")
      .insert({ url: path, section: data.section, caption: data.caption || null });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeletePhoto = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => tokenInput.extend({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    await gate(data.token);
    const client = await db();
    const { data: row } = await client.from("photos").select("url").eq("id", data.id).maybeSingle();
    if (row?.url && !String(row.url).startsWith("http")) {
      await client.storage.from("site-photos").remove([String(row.url)]);
    }
    const { error } = await client.from("photos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------- Content ---------------- */

export const adminListContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => tokenInput.parse(input))
  .handler(async ({ data }) => {
    await gate(data.token);
    const { data: rows, error } = await (await db())
      .from("site_content")
      .select("*")
      .order("key", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminSaveContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    tokenInput.extend({ key: z.string().min(1).max(80), value: z.string().max(4000) }).parse(input),
  )
  .handler(async ({ data }) => {
    await gate(data.token);
    const { error } = await (await db())
      .from("site_content")
      .upsert({ key: data.key, value: data.value, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
