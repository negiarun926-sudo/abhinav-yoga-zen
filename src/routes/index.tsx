import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import {
  About,
  Booking,
  Classes,
  Contact,
  Footer,
  Gallery,
  Online,
  Outside,
  Pillars,
  Stats,
  Testimonials,
  Thoughts,
} from "@/components/site/Sections";

const title = "Abhinav Yoga — Yoga & Movement with Abhinav Maithani";
const description =
  "Online and outdoor yoga with Abhinav Maithani: traditional yoga, power yoga, mobility, flexibility, pranayama and meditation. Book a class.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Stats />
        <Classes />
        <Online />
        <Outside />
        <Thoughts />
        <Pillars />
        <Testimonials />
        <Gallery />
        <Booking />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
