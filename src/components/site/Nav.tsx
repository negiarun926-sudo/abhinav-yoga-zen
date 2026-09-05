import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, whatsappLink } from "@/lib/site";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-700",
        scrolled
          ? "bg-background/85 py-3 shadow-[0_1px_0_0_var(--border)] backdrop-blur-xl"
          : "bg-transparent py-6",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[1400px] items-center justify-between px-5 md:px-10"
      >
        <a
          href="#home"
          className={cn(
            "font-serif text-lg tracking-[0.32em] uppercase transition-colors duration-700",
            scrolled || open ? "text-foreground" : "text-cream",
          )}
        >
          Abhinav Yoga
        </a>

        <ul className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  "text-[0.68rem] tracking-[0.2em] uppercase transition-opacity duration-300 hover:opacity-55",
                  scrolled ? "text-foreground" : "text-cream",
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#booking"
            className={cn(
              "hidden px-6 py-3 text-[0.66rem] tracking-[0.22em] uppercase transition-all duration-500 md:inline-flex",
              scrolled
                ? "bg-forest text-forest-foreground hover:bg-charcoal"
                : "border border-cream/70 text-cream hover:bg-cream hover:text-charcoal",
            )}
          >
            Book a class
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "p-2 lg:hidden",
              scrolled || open ? "text-foreground" : "text-cream",
            )}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "fixed inset-0 top-0 z-40 flex flex-col justify-center bg-background px-8 transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <ul className="space-y-1">
          {NAV_LINKS.map((link, i) => (
            <li
              key={link.href}
              style={{ transitionDelay: `${open ? i * 45 : 0}ms` }}
              className={cn(
                "transition-all duration-500",
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
            >
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-serif text-4xl text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col gap-3">
          <a
            href="#booking"
            onClick={() => setOpen(false)}
            className="bg-forest px-7 py-4 text-center text-[0.7rem] tracking-[0.22em] text-forest-foreground uppercase"
          >
            Book a class
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-foreground px-7 py-4 text-center text-[0.7rem] tracking-[0.22em] uppercase"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
