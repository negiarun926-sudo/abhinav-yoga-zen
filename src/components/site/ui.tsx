import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[0.7rem] font-medium uppercase tracking-[0.22em] transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60 disabled:pointer-events-none px-7 py-4";

export const variants = {
  solid: "bg-forest text-forest-foreground hover:bg-charcoal",
  outline: "border border-current text-foreground hover:bg-foreground hover:text-background",
  light: "border border-cream/60 text-cream hover:bg-cream hover:text-charcoal",
  gold: "bg-gold text-charcoal hover:bg-clay hover:text-cream",
  ghost: "text-foreground hover:opacity-60",
} as const;

type Variant = keyof typeof variants;

export function ActionLink({
  variant = "solid",
  className,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; children: ReactNode }) {
  return (
    <a className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </a>
  );
}

export function ActionButton({
  variant = "solid",
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="eyebrow mb-6">{children}</p>;
}
