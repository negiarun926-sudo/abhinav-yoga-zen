export const IMAGES = {
  hero: {
    url: "/images/hero-wildthing.jpg",
    alt: "Abhinav Maithani in wild thing pose on a rock beside a turquoise river",
  },
  portrait: {
    url: "/images/portrait-river.jpg",
    alt: "Abhinav Maithani standing in the river with hands in prayer position",
  },
  forearm: {
    url: "/images/pose-forearm.jpg",
    alt: "Abhinav Maithani in a forearm balance with legs lifted, mist over the river behind him",
  },
  crow: {
    url: "/images/pose-crow.jpg",
    alt: "Abhinav Maithani holding crow pose on a forest path",
  },
  wheel: {
    url: "/images/pose-wheel.jpg",
    alt: "Abhinav Maithani in wheel pose on a riverside platform",
  },
  fold: {
    url: "/images/pose-fold.jpg",
    alt: "Abhinav Maithani in a bound standing forward fold beside the river",
  },
  splits: {
    url: "/images/pose-splits.jpg",
    alt: "Abhinav Maithani in full front splits with arms raised",
  },
  balance: {
    url: "/images/pose-balance.jpg",
    alt: "Abhinav Maithani in a standing balance pose on stone steps",
  },
} as const;


export const CONTACT = {
  name: "Abhinav Maithani",
  brand: "Abhinav Yoga",
  phoneDisplay: "+91 76687 09279",
  phoneRaw: "917668709279",
  email: "abhinavmaithani24@gmail.com",
  instagramHandle: "@abhinav__yoga",
  instagramUrl: "https://www.instagram.com/abhinav__yoga",
};

export const WHATSAPP_MESSAGE =
  "Hi Abhinav, I'm interested in your yoga classes. I'd like to know more about the classes and booking process.";

export function whatsappLink(message: string = WHATSAPP_MESSAGE) {
  return `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(message)}`;
}

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Classes", href: "#classes" },
  { label: "Online Yoga", href: "#online" },
  { label: "Experiences", href: "#outside" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export const CLASSES = [
  {
    title: "Online Yoga Classes",
    text: "Practice from anywhere with guided online yoga sessions.",
    image: IMAGES.splits,
  },
  {
    title: "Traditional Yoga",
    text: "Explore traditional yoga practices with emphasis on awareness, breath and movement.",
    image: IMAGES.fold,
  },
  {
    title: "Power Yoga",
    text: "Dynamic yoga practice designed around strength, movement and endurance.",
    image: IMAGES.crow,
  },
  {
    title: "Mobility",
    text: "Improve movement quality, joint mobility and body awareness.",
    image: IMAGES.wheel,
  },
  {
    title: "Flexibility",
    text: "Progressive practice focused on improving range of motion and control.",
    image: IMAGES.balance,
  },
  {
    title: "Pranayama",
    text: "Traditional breathing practices focused on breath awareness and control.",
    image: IMAGES.portrait,
  },
  {
    title: "Meditation",
    text: "Create space for stillness, awareness and mental clarity.",
    image: IMAGES.hero,
  },
  {
    title: "Strength & Movement",
    text: "Build strength and movement capacity alongside your yoga practice.",
    image: IMAGES.forearm,
  },
];

export const SERVICE_OPTIONS = CLASSES.map((c) => c.title);
