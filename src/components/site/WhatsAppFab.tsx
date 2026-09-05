import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp with Abhinav"
      className="fixed right-4 bottom-4 z-50 flex items-center gap-3 rounded-full bg-forest px-4 py-3 text-forest-foreground shadow-lg transition-all duration-500 hover:bg-charcoal md:right-7 md:bottom-7 md:px-5"
    >
      <MessageCircle className="size-5" aria-hidden="true" />
      <span className="hidden text-[0.66rem] tracking-[0.2em] uppercase sm:inline">
        Chat on WhatsApp
      </span>
    </a>
  );
}
