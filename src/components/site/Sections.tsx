import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Instagram, Mail, Phone, Star } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./ui";
import { useCountUp, useReveal } from "@/hooks/use-reveal";
import { CLASSES, CONTACT, IMAGES, SERVICE_OPTIONS, whatsappLink } from "@/lib/site";
import {
  listApprovedReviews,
  listGalleryPhotos,
  submitEnquiry,
  submitReview,
} from "@/lib/public.functions";
import { cn } from "@/lib/utils";

const STATS = [
  { value: 129, suffix: "K+", label: "Instagram followers" },
  { value: 10, suffix: "K+", label: "Students trained" },
  { value: 565, suffix: "+", label: "Posts shared" },
];

const PILLARS = [
  { title: "Breath", text: "Steady, conscious breathing as the base of every practice." },
  { title: "Movement", text: "Mindful movement that builds strength, mobility and control." },
  { title: "Stillness", text: "Space for meditation, quiet and mental clarity." },
  { title: "Consistency", text: "Small, regular practice that compounds over time." },
];

const THOUGHTS = [
  "Yoga is not about touching your toes. It is about what you learn on the way down.",
  "Strength and softness can live in the same body.",
  "The breath is the bridge between the body and the mind.",
];

/* ---------------- Intro + About ---------------- */

export function About() {
  return (
    <section id="about" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
      <Reveal>
        <SectionLabel>Introduction</SectionLabel>
        <h2 className="display max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
          A practice rooted in breath, movement and awareness.
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <div className="overflow-hidden">
            <img
              src={IMAGES.portrait.url}
              alt={IMAGES.portrait.alt}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1600ms] hover:scale-[1.04]"
            />
          </div>
        </Reveal>

        <Reveal delay={120} className="flex flex-col justify-center">
          <SectionLabel>About Abhinav</SectionLabel>
          <h3 className="display text-3xl sm:text-4xl">{CONTACT.name}</h3>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Abhinav Maithani is a yoga teacher whose practice is shaped by the mountains and
              rivers he grew up around. His teaching brings together traditional yoga, breathwork
              and modern movement.
            </p>
            <p>
              He works with students of every level — from complete beginners finding their first
              steady breath, to practitioners refining strength, mobility and advanced postures.
            </p>
            <p>
              Sessions are guided, personal and paced to your body, whether you practise online
              from home or outdoors in the mountains.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#booking"
              className="bg-forest px-7 py-4 text-[0.7rem] tracking-[0.22em] text-forest-foreground uppercase transition-colors duration-500 hover:bg-charcoal"
            >
              Book a class
            </a>
            <a
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-foreground/30 px-7 py-4 text-[0.7rem] tracking-[0.22em] uppercase transition-colors duration-500 hover:bg-foreground hover:text-background"
            >
              {CONTACT.instagramHandle}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Stats ---------------- */

function Stat({ value, suffix, label }: (typeof STATS)[number]) {
  const { ref, shown } = useReveal<HTMLDivElement>(0.4);
  const n = useCountUp(value, shown);
  return (
    <div ref={ref} className="text-center">
      <p className="display text-5xl sm:text-6xl">
        {n}
        {suffix}
      </p>
      <p className="eyebrow mt-4">{label}</p>
    </div>
  );
}

export function Stats() {
  return (
    <section className="border-y border-border bg-sand/50">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-20 sm:grid-cols-3 md:px-10">
        {STATS.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}

/* ---------------- Classes ---------------- */

export function Classes() {
  return (
    <section id="classes" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
      <Reveal>
        <SectionLabel>Classes</SectionLabel>
        <h2 className="display max-w-2xl text-4xl sm:text-5xl lg:text-6xl">
          Choose the practice that fits you.
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {CLASSES.map((c, i) => (
          <Reveal key={c.title} delay={(i % 4) * 90} as="article" className="group">
            <div className="overflow-hidden">
              <img
                src={c.image.url}
                alt={c.image.alt}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.06]"
              />
            </div>
            <h3 className="mt-6 font-serif text-2xl">{c.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120} className="mt-14">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex bg-forest px-8 py-4 text-[0.7rem] tracking-[0.22em] text-forest-foreground uppercase transition-colors duration-500 hover:bg-charcoal"
        >
          Ask about a class
        </a>
      </Reveal>
    </section>
  );
}

/* ---------------- Online yoga ---------------- */

export function Online() {
  return (
    <section id="online" className="bg-charcoal text-cream">
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow text-cream/70">Online Yoga</p>
          <h2 className="display mt-6 text-4xl sm:text-5xl lg:text-6xl">
            Practise with Abhinav from anywhere.
          </h2>
          <div className="mt-7 space-y-5 text-cream/80">
            <p>
              Live guided sessions over video, planned around your level, your schedule and the
              space you have at home.
            </p>
            <p>
              One-to-one and small group sessions are available. Reach out on WhatsApp to talk
              through timings and what you would like to work on.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-cream px-8 py-4 text-[0.7rem] tracking-[0.22em] text-charcoal uppercase transition-colors duration-500 hover:bg-gold"
            >
              Join online classes
            </a>
            <a
              href="#booking"
              className="border border-cream/60 px-8 py-4 text-[0.7rem] tracking-[0.22em] text-cream uppercase transition-colors duration-500 hover:bg-cream hover:text-charcoal"
            >
              Send an enquiry
            </a>
          </div>
        </Reveal>
        <Reveal delay={140}>
          <img
            src={IMAGES.forearm.url}
            alt={IMAGES.forearm.alt}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Outdoor experiences ---------------- */

export function Outside() {
  return (
    <section id="outside" className="relative overflow-hidden">
      <img
        src={IMAGES.wheel.url}
        alt={IMAGES.wheel.alt}
        loading="lazy"
        className="h-[70vh] min-h-[460px] w-full object-cover"
      />
      <div className="image-veil absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 flex items-end">
        <Reveal className="mx-auto w-full max-w-[1400px] px-5 pb-16 md:px-10 md:pb-24">
          <p className="eyebrow text-cream/75">Experiences</p>
          <h2 className="display mt-5 max-w-2xl text-4xl text-cream sm:text-5xl lg:text-6xl">
            Yoga outside — rivers, forests and mountain air.
          </h2>
          <p className="mt-6 max-w-xl text-cream/85">
            Outdoor sessions and mountain practice, where the surroundings become part of the
            practice itself.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Thoughts + Pillars ---------------- */

export function Thoughts() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <SectionLabel>Yoga thoughts</SectionLabel>
      </Reveal>
      <div className="grid gap-10 md:grid-cols-3">
        {THOUGHTS.map((t, i) => (
          <Reveal key={t} delay={i * 110}>
            <p className="font-serif text-2xl leading-snug sm:text-[1.7rem]">&ldquo;{t}&rdquo;</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Pillars() {
  return (
    <section className="border-y border-border bg-sand/40">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <SectionLabel>The practice</SectionLabel>
          <h2 className="display max-w-2xl text-4xl sm:text-5xl">Four pillars.</h2>
        </Reveal>
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <p className="eyebrow">0{i + 1}</p>
              <h3 className="mt-4 font-serif text-2xl">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1" role={onChange ? "radiogroup" : undefined} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        const icon = (
          <Star className={cn("size-5", filled ? "fill-gold text-gold" : "text-muted-foreground")} />
        );
        return onChange ? (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
            className="p-0.5"
          >
            {icon}
          </button>
        ) : (
          <span key={n}>{icon}</span>
        );
      })}
    </div>
  );
}

export function Testimonials() {
  const qc = useQueryClient();
  const list = useServerFn(listApprovedReviews);
  const send = useServerFn(submitReview);
  const { data: reviews = [] } = useQuery({ queryKey: ["reviews"], queryFn: () => list() });

  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: () => send({ data: { name, rating, body } }),
    onSuccess: () => {
      setDone(true);
      setName("");
      setBody("");
      setRating(5);
      setError("");
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (e: Error) => setError(e.message || "Something went wrong. Please try again."),
  });

  return (
    <section id="testimonials" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <SectionLabel>Testimonials</SectionLabel>
        <h2 className="display max-w-2xl text-4xl sm:text-5xl lg:text-6xl">
          Words from students.
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
        <div className="space-y-8">
          {reviews.length === 0 ? (
            <p className="text-muted-foreground">
              No reviews published yet. If you have practised with Abhinav, yours could be the
              first.
            </p>
          ) : (
            reviews.map((r, i) => (
              <Reveal key={r.id} delay={(i % 3) * 90} as="article" className="border-t border-border pt-8">
                <Stars value={r.rating} />
                <p className="mt-5 font-serif text-xl leading-snug">&ldquo;{r.body}&rdquo;</p>
                <p className="eyebrow mt-4">{r.name}</p>
              </Reveal>
            ))
          )}
        </div>

        <Reveal delay={100} className="bg-sand/50 p-7 md:p-9">
          <h3 className="font-serif text-2xl">Leave a review</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Reviews are published after they have been read by Abhinav.
          </p>
          {done ? (
            <p className="mt-8 text-sm">
              Thank you — your review has been sent and will appear once it is approved.
            </p>
          ) : (
            <form
              className="mt-7 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                mutation.mutate();
              }}
            >
              <div>
                <label htmlFor="rv-name" className="eyebrow block">
                  Your name
                </label>
                <input
                  id="rv-name"
                  required
                  maxLength={80}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full border-b border-foreground/25 bg-transparent py-2 outline-none focus:border-forest"
                />
              </div>
              <div>
                <span className="eyebrow block">Rating</span>
                <div className="mt-2">
                  <Stars value={rating} onChange={setRating} />
                </div>
              </div>
              <div>
                <label htmlFor="rv-body" className="eyebrow block">
                  Your review
                </label>
                <textarea
                  id="rv-body"
                  required
                  rows={4}
                  maxLength={1200}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="mt-2 w-full resize-none border-b border-foreground/25 bg-transparent py-2 outline-none focus:border-forest"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-forest px-7 py-4 text-[0.7rem] tracking-[0.22em] text-forest-foreground uppercase transition-colors duration-500 hover:bg-charcoal disabled:opacity-60"
              >
                {mutation.isPending ? "Sending…" : "Submit review"}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Gallery ---------------- */

export function Gallery() {
  const list = useServerFn(listGalleryPhotos);
  const { data: photos = [] } = useQuery({ queryKey: ["gallery"], queryFn: () => list() });

  const fallback = [
    IMAGES.splits,
    IMAGES.crow,
    IMAGES.balance,
    IMAGES.fold,
    IMAGES.forearm,
    IMAGES.hero,
  ];

  const items =
    photos.length > 0
      ? photos.map((p) => ({ url: p.url, alt: p.caption || "Yoga practice photograph" }))
      : fallback;

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel>Gallery</SectionLabel>
            <h2 className="display text-4xl sm:text-5xl">From the practice.</h2>
          </div>
          <a
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase hover:opacity-60"
          >
            <Instagram className="size-4" /> {CONTACT.instagramHandle}
          </a>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3">
          {items.map((p, i) => (
            <Reveal key={`${p.url}-${i}`} delay={(i % 3) * 80} className="overflow-hidden">
              <img
                src={p.url}
                alt={p.alt}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-[1400ms] hover:scale-[1.06]"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Booking + Contact ---------------- */

export function Booking() {
  const send = useServerFn(submitEnquiry);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: SERVICE_OPTIONS[0] ?? "",
    preferred_date: "",
    preferred_time: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: () => send({ data: form }),
    onSuccess: () => {
      setDone(true);
      setError("");
    },
    onError: (e: Error) => setError(e.message || "Something went wrong. Please try again."),
  });

  const field =
    "mt-2 w-full border-b border-foreground/25 bg-transparent py-2 outline-none focus:border-forest";

  return (
    <section id="booking" className="bg-sand/40">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <SectionLabel>Book a class</SectionLabel>
          <h2 className="display text-4xl sm:text-5xl lg:text-6xl">
            Tell Abhinav what you&rsquo;d like to practise.
          </h2>
          <p className="mt-6 max-w-md text-muted-foreground">
            Send an enquiry and Abhinav will get back to you personally with availability and
            details. You can also message directly on WhatsApp.
          </p>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex bg-forest px-8 py-4 text-[0.7rem] tracking-[0.22em] text-forest-foreground uppercase transition-colors duration-500 hover:bg-charcoal"
          >
            Chat on WhatsApp
          </a>
        </Reveal>

        <Reveal delay={120}>
          {done ? (
            <div className="border border-border bg-background p-8">
              <h3 className="font-serif text-2xl">Thank you.</h3>
              <p className="mt-3 text-muted-foreground">
                Your enquiry has been received. Abhinav will reply to you soon.
              </p>
            </div>
          ) : (
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                mutation.mutate();
              }}
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="bk-name" className="eyebrow block">
                    Name
                  </label>
                  <input
                    id="bk-name"
                    required
                    className={field}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="bk-phone" className="eyebrow block">
                    Phone
                  </label>
                  <input
                    id="bk-phone"
                    required
                    type="tel"
                    className={field}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="bk-email" className="eyebrow block">
                    Email (optional)
                  </label>
                  <input
                    id="bk-email"
                    type="email"
                    className={field}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="bk-service" className="eyebrow block">
                    Class of interest
                  </label>
                  <select
                    id="bk-service"
                    className={field}
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                  >
                    {SERVICE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="bk-date" className="eyebrow block">
                    Preferred date
                  </label>
                  <input
                    id="bk-date"
                    type="date"
                    className={field}
                    value={form.preferred_date}
                    onChange={(e) => setForm({ ...form, preferred_date: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="bk-time" className="eyebrow block">
                    Preferred time
                  </label>
                  <input
                    id="bk-time"
                    type="time"
                    className={field}
                    value={form.preferred_time}
                    onChange={(e) => setForm({ ...form, preferred_time: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="bk-msg" className="eyebrow block">
                    Message
                  </label>
                  <textarea
                    id="bk-msg"
                    rows={4}
                    className={cn(field, "resize-none")}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-forest px-7 py-4 text-[0.7rem] tracking-[0.22em] text-forest-foreground uppercase transition-colors duration-500 hover:bg-charcoal disabled:opacity-60 sm:w-auto"
              >
                {mutation.isPending ? "Sending…" : "Send enquiry"}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <SectionLabel>Contact</SectionLabel>
        <h2 className="display max-w-2xl text-4xl sm:text-5xl">Get in touch.</h2>
      </Reveal>
      <div className="mt-12 grid gap-10 sm:grid-cols-3">
        <Reveal>
          <p className="eyebrow">Phone &amp; WhatsApp</p>
          <a
            href={`tel:+${CONTACT.phoneRaw}`}
            className="mt-3 inline-flex items-center gap-2 font-serif text-2xl hover:opacity-60"
          >
            <Phone className="size-4" /> {CONTACT.phoneDisplay}
          </a>
        </Reveal>
        <Reveal delay={90}>
          <p className="eyebrow">Email</p>
          <a
            href={`mailto:${CONTACT.email}`}
            className="mt-3 inline-flex items-center gap-2 break-all font-serif text-xl hover:opacity-60"
          >
            <Mail className="size-4 shrink-0" /> {CONTACT.email}
          </a>
        </Reveal>
        <Reveal delay={180}>
          <p className="eyebrow">Instagram</p>
          <a
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 font-serif text-2xl hover:opacity-60"
          >
            <Instagram className="size-4" /> {CONTACT.instagramHandle}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-14 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="font-serif text-lg tracking-[0.32em] uppercase">Abhinav Yoga</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-3">
          {["About", "Classes", "Online", "Testimonials", "Contact"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-[0.68rem] tracking-[0.2em] text-cream/75 uppercase hover:text-cream"
            >
              {l}
            </a>
          ))}
        </nav>
        <p className="text-xs text-cream/60">© 2025 Abhinav Yoga. All rights reserved.</p>
      </div>
    </footer>
  );
}
