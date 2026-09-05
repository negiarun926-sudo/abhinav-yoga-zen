import { useEffect, useState } from "react";
import { IMAGES, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Hero() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setOffset(Math.min(window.scrollY, 900)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const step = (i: number) =>
    cn("animate-soft-in") + ` [animation-delay:${i}ms]`;

  return (
    <section id="home" className="relative h-[100svh] min-h-[620px] w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ transform: `translate3d(0, ${offset * 0.28}px, 0)` }}
      >
        <img
          src={IMAGES.hero.url}
          alt={IMAGES.hero.alt}
          fetchPriority="high"
          className="animate-ken h-[112%] w-full object-cover object-[60%_center]"
        />
      </div>
      <div className="image-veil absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_35%,color-mix(in_oklab,var(--charcoal)_55%,transparent)_100%)]"
        aria-hidden="true"
      />

      <div
        className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 pb-20 md:px-10 md:pb-28"
        style={{ transform: `translate3d(0, ${offset * -0.08}px, 0)`, opacity: 1 - offset / 700 }}
      >
        <p
          className={cn("eyebrow text-cream/80", step(300))}
          style={{ animationDelay: "300ms" }}
        >
          Abhinav Maithani — Yoga &amp; Movement
        </p>
        <h1
          className="display mt-5 max-w-4xl text-[3.1rem] text-cream sm:text-7xl lg:text-8xl animate-soft-in"
          style={{ animationDelay: "520ms" }}
        >
          Find your balance.
        </h1>
        <p
          className="animate-soft-in mt-7 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg"
          style={{ animationDelay: "780ms" }}
        >
          Yoga that helps you move better, breathe deeper and build a stronger connection with
          yourself.
        </p>
        <div
          className="animate-soft-in mt-10 flex flex-col gap-3 sm:flex-row"
          style={{ animationDelay: "1000ms" }}
        >
          <a
            href="#booking"
            className="bg-cream px-8 py-4 text-center text-[0.7rem] tracking-[0.22em] text-charcoal uppercase transition-colors duration-500 hover:bg-gold"
          >
            Start your yoga journey
          </a>
          <a
            href="#classes"
            className="border border-cream/70 px-8 py-4 text-center text-[0.7rem] tracking-[0.22em] text-cream uppercase transition-colors duration-500 hover:bg-cream hover:text-charcoal"
          >
            Explore classes
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 text-center text-[0.7rem] tracking-[0.22em] text-cream/80 uppercase underline-offset-8 transition-opacity duration-500 hover:opacity-70 sm:underline"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
