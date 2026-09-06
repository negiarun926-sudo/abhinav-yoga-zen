import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminDeleteEnquiry,
  adminDeletePhoto,
  adminDeletePricing,
  adminDeleteReview,
  adminListContent,
  adminListEnquiries,
  adminListPhotos,
  adminListPricing,
  adminListReviews,
  adminLogin,
  adminSaveContent,
  adminSavePricing,
  adminSetReviewStatus,
  adminUploadPhoto,
  adminVerify,
} from "@/lib/admin.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Abhinav Yoga" },
      { name: "description", content: "Private dashboard for Abhinav Yoga." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin — Abhinav Yoga" },
      { property: "og:description", content: "Private dashboard for Abhinav Yoga." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const STORE_KEY = "abhinav-admin-token";
const TABS = ["Enquiries", "Reviews", "Photos", "Pricing", "Content"] as const;
type Tab = (typeof TABS)[number];

const btn =
  "px-5 py-2.5 text-[0.68rem] tracking-[0.2em] uppercase transition-colors duration-300 disabled:opacity-60";
const field = "w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-forest";

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-border bg-card p-6">
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const verify = useServerFn(adminVerify);

  useEffect(() => {
    const stored = localStorage.getItem(STORE_KEY);
    if (!stored) {
      setReady(true);
      return;
    }
    verify({ data: { token: stored } })
      .then((r) => {
        if (r.ok) setToken(stored);
        else localStorage.removeItem(STORE_KEY);
      })
      .finally(() => setReady(true));
  }, [verify]);

  if (!ready) return <div className="p-10 text-sm text-muted-foreground">Loading…</div>;
  if (!token)
    return (
      <Login
        onLogin={(t) => {
          localStorage.setItem(STORE_KEY, t);
          setToken(t);
        }}
      />
    );

  return (
    <Dashboard
      token={token}
      onLogout={() => {
        localStorage.removeItem(STORE_KEY);
        setToken(null);
      }}
    />
  );
}

function Login({ onLogin }: { onLogin: (t: string) => void }) {
  const login = useServerFn(adminLogin);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: () => login({ data: { username, password } }),
    onSuccess: (r) => {
      if (r.ok && r.token) onLogin(r.token);
      else setError("Incorrect username or password.");
    },
    onError: () => setError("Sign in failed. Please try again."),
  });

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <form
        className="w-full max-w-sm border border-border bg-card p-8"
        onSubmit={(e) => {
          e.preventDefault();
          setError("");
          mutation.mutate();
        }}
      >
        <h1 className="font-serif text-3xl">Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to manage the site.</p>
        <div className="mt-7 space-y-4">
          <div>
            <label htmlFor="u" className="eyebrow block">
              Username
            </label>
            <input
              id="u"
              className={cn(field, "mt-2")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label htmlFor="p" className="eyebrow block">
              Password
            </label>
            <input
              id="p"
              type="password"
              className={cn(field, "mt-2")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
        </div>
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={mutation.isPending}
          className={cn(btn, "mt-7 w-full bg-forest text-forest-foreground hover:bg-charcoal")}
        >
          {mutation.isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("Enquiries");

  return (
    <main className="mx-auto max-w-[1200px] px-5 py-12 md:px-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Abhinav Yoga</p>
          <h1 className="display text-4xl">Dashboard</h1>
        </div>
        <button onClick={onLogout} className={cn(btn, "border border-border hover:bg-muted")}>
          Sign out
        </button>
      </header>

      <nav className="mt-10 flex flex-wrap gap-2 border-b border-border pb-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              btn,
              tab === t ? "bg-forest text-forest-foreground" : "hover:bg-muted",
            )}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="mt-10">
        {tab === "Enquiries" && <Enquiries token={token} />}
        {tab === "Reviews" && <Reviews token={token} />}
        {tab === "Photos" && <Photos token={token} />}
        {tab === "Pricing" && <Pricing token={token} />}
        {tab === "Content" && <Content token={token} />}
      </div>
    </main>
  );
}

/* ---------------- Enquiries ---------------- */

function Enquiries({ token }: { token: string }) {
  const qc = useQueryClient();
  const list = useServerFn(adminListEnquiries);
  const del = useServerFn(adminDeleteEnquiry);
  const { data = [] } = useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: () => list({ data: { token } }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { token, id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-enquiries"] }),
  });

  return (
    <Panel title={`Enquiries (${data.length})`}>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No enquiries yet.</p>
      ) : (
        <ul className="space-y-4">
          {data.map((e) => (
            <li key={e.id} className="border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-xl">{e.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {e.phone}
                    {e.email ? ` · ${e.email}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => remove.mutate(e.id)}
                  className={cn(btn, "border border-border hover:bg-muted")}
                >
                  Delete
                </button>
              </div>
              <p className="mt-3 text-sm">
                {[e.service, e.preferred_date, e.preferred_time].filter(Boolean).join(" · ")}
              </p>
              {e.message && <p className="mt-3 text-sm text-muted-foreground">{e.message}</p>}
              <p className="eyebrow mt-4">{new Date(e.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* ---------------- Reviews ---------------- */

function Reviews({ token }: { token: string }) {
  const qc = useQueryClient();
  const list = useServerFn(adminListReviews);
  const setStatus = useServerFn(adminSetReviewStatus);
  const del = useServerFn(adminDeleteReview);
  const { data = [] } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: () => list({ data: { token } }),
  });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-reviews"] });
  const update = useMutation({
    mutationFn: (v: { id: string; status: "approved" | "rejected" | "pending" }) =>
      setStatus({ data: { token, ...v } }),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { token, id } }),
    onSuccess: invalidate,
  });

  return (
    <Panel title={`Reviews (${data.length})`}>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {data.map((r) => (
            <li key={r.id} className="border border-border p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-serif text-xl">
                  {r.name} · {r.rating}★
                </p>
                <span className="eyebrow">{r.status}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{r.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => update.mutate({ id: r.id, status: "approved" })}
                  className={cn(btn, "bg-forest text-forest-foreground hover:bg-charcoal")}
                >
                  Approve
                </button>
                <button
                  onClick={() => update.mutate({ id: r.id, status: "rejected" })}
                  className={cn(btn, "border border-border hover:bg-muted")}
                >
                  Hide
                </button>
                <button
                  onClick={() => remove.mutate(r.id)}
                  className={cn(btn, "border border-border text-destructive hover:bg-muted")}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* ---------------- Photos ---------------- */

function Photos({ token }: { token: string }) {
  const qc = useQueryClient();
  const list = useServerFn(adminListPhotos);
  const upload = useServerFn(adminUploadPhoto);
  const del = useServerFn(adminDeletePhoto);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const { data = [] } = useQuery({
    queryKey: ["admin-photos"],
    queryFn: () => list({ data: { token } }),
  });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-photos"] });
  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { token, id } }),
    onSuccess: invalidate,
  });

  async function onFile(file: File) {
    setBusy(true);
    setError("");
    try {
      const buf = new Uint8Array(await file.arrayBuffer());
      let bin = "";
      for (const b of buf) bin += String.fromCharCode(b);
      await upload({
        data: {
          token,
          filename: file.name,
          contentType: file.type || "image/jpeg",
          dataBase64: btoa(bin),
          section: "gallery",
          caption,
        },
      });
      setCaption("");
      invalidate();
    } catch (e) {
      setError((e as Error).message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel title="Gallery photos">
      <div className="space-y-3">
        <input
          className={field}
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
            e.target.value = "";
          }}
          className="block text-sm"
        />
        {busy && <p className="text-sm text-muted-foreground">Uploading…</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {data.map((p) => (
          <figure key={p.id} className="border border-border">
            <img
              src={p.preview}
              alt={p.caption ?? "Gallery photo"}
              className="aspect-square w-full object-cover"
            />
            <figcaption className="p-3">
              <p className="truncate text-xs text-muted-foreground">{p.caption ?? "—"}</p>
              <button
                onClick={() => remove.mutate(p.id)}
                className={cn(btn, "mt-2 w-full border border-border hover:bg-muted")}
              >
                Delete
              </button>
            </figcaption>
          </figure>
        ))}
      </div>
    </Panel>
  );
}

/* ---------------- Pricing ---------------- */

const emptyPricing = {
  class_name: "",
  package_name: "",
  price: "",
  duration: "",
  description: "",
  active: true,
};

function Pricing({ token }: { token: string }) {
  const qc = useQueryClient();
  const list = useServerFn(adminListPricing);
  const save = useServerFn(adminSavePricing);
  const del = useServerFn(adminDeletePricing);
  const [values, setValues] = useState(emptyPricing);
  const [editing, setEditing] = useState<string | null>(null);

  const { data = [] } = useQuery({
    queryKey: ["admin-pricing"],
    queryFn: () => list({ data: { token } }),
  });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-pricing"] });
  const submit = useMutation({
    mutationFn: () => save({ data: { token, id: editing, values } }),
    onSuccess: () => {
      setValues(emptyPricing);
      setEditing(null);
      invalidate();
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { token, id } }),
    onSuccess: invalidate,
  });

  return (
    <Panel title="Private pricing">
      <p className="text-sm text-muted-foreground">
        Rates are private and never shown on the public site.
      </p>
      <form
        className="mt-6 grid gap-3 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit.mutate();
        }}
      >
        <input
          className={field}
          placeholder="Class name"
          required
          value={values.class_name}
          onChange={(e) => setValues({ ...values, class_name: e.target.value })}
        />
        <input
          className={field}
          placeholder="Package"
          value={values.package_name}
          onChange={(e) => setValues({ ...values, package_name: e.target.value })}
        />
        <input
          className={field}
          placeholder="Price"
          value={values.price}
          onChange={(e) => setValues({ ...values, price: e.target.value })}
        />
        <input
          className={field}
          placeholder="Duration"
          value={values.duration}
          onChange={(e) => setValues({ ...values, duration: e.target.value })}
        />
        <textarea
          className={cn(field, "sm:col-span-2")}
          rows={2}
          placeholder="Notes"
          value={values.description}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
        />
        <div className="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={submit.isPending}
            className={cn(btn, "bg-forest text-forest-foreground hover:bg-charcoal")}
          >
            {editing ? "Update rate" : "Add rate"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setValues(emptyPricing);
              }}
              className={cn(btn, "border border-border hover:bg-muted")}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="mt-8 space-y-3">
        {data.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 border border-border p-4">
            <div>
              <p className="font-serif text-lg">
                {p.class_name}
                {p.package_name ? ` · ${p.package_name}` : ""}
              </p>
              <p className="text-sm text-muted-foreground">
                {[p.price, p.duration].filter(Boolean).join(" · ")}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditing(p.id);
                  setValues({
                    class_name: p.class_name ?? "",
                    package_name: p.package_name ?? "",
                    price: p.price ?? "",
                    duration: p.duration ?? "",
                    description: p.description ?? "",
                    active: p.active ?? true,
                  });
                }}
                className={cn(btn, "border border-border hover:bg-muted")}
              >
                Edit
              </button>
              <button
                onClick={() => remove.mutate(p.id)}
                className={cn(btn, "border border-border text-destructive hover:bg-muted")}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ---------------- Content ---------------- */

const CONTENT_KEYS = [
  { key: "hero_heading", label: "Hero heading" },
  { key: "hero_subtext", label: "Hero supporting text" },
  { key: "about_text", label: "About Abhinav" },
  { key: "online_text", label: "Online yoga text" },
  { key: "contact_note", label: "Contact note" },
];

function Content({ token }: { token: string }) {
  const qc = useQueryClient();
  const list = useServerFn(adminListContent);
  const save = useServerFn(adminSaveContent);
  const { data = [] } = useQuery({
    queryKey: ["admin-content"],
    queryFn: () => list({ data: { token } }),
  });
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState("");

  const submit = useMutation({
    mutationFn: (v: { key: string; value: string }) => save({ data: { token, ...v } }),
    onSuccess: (_r, v) => {
      setSaved(v.key);
      qc.invalidateQueries({ queryKey: ["admin-content"] });
    },
  });

  const valueFor = (key: string) =>
    draft[key] ?? (data.find((d) => d.key === key)?.value as string | undefined) ?? "";

  return (
    <Panel title="Site content">
      <div className="space-y-6">
        {CONTENT_KEYS.map((c) => (
          <div key={c.key}>
            <label htmlFor={c.key} className="eyebrow block">
              {c.label}
            </label>
            <textarea
              id={c.key}
              rows={3}
              className={cn(field, "mt-2")}
              value={valueFor(c.key)}
              onChange={(e) => setDraft({ ...draft, [c.key]: e.target.value })}
            />
            <button
              onClick={() => submit.mutate({ key: c.key, value: valueFor(c.key) })}
              className={cn(btn, "mt-2 bg-forest text-forest-foreground hover:bg-charcoal")}
            >
              Save
            </button>
            {saved === c.key && <span className="ml-3 text-xs text-muted-foreground">Saved</span>}
          </div>
        ))}
      </div>
    </Panel>
  );
}
