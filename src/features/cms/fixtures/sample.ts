import { abstractArt, logoArt, portraitArt } from "../art";
import { createBlock } from "../registry";
import type { Block, CompanyRecord, LayoutSettings, LayoutText, Locale } from "../types";
import { createSnapshots } from "./snapshots";

export function samplePage(): Block[] {
  const img = (n: number, label?: string) => abstractArt(n, label ? { label } : {});
  return [
    createBlock("banner", {
      id: "s_1",
      label: "Banner",
      content: {
        message: "Sample $10 preview — fictional content for demonstrating every block.",
        linkLabel: "See plans",
        linkUrl: "#pricing",
        enabled: true,
      },
      options: { bannerTone: "offer", placement: "top" },
    }),
    createBlock("hero", {
      id: "s_2",
      label: "Hero",
      anchor: "top",
      content: {
        eyebrow: "Sample Studio",
        heading: "A demonstration company page",
        intro: "Every block in the registry, rendered by the same engine the editor uses.",
        image: img(3),
        alt: "Abstract architectural composition",
        actionLabel: "Explore blocks",
        actionHref: "#gallery",
      },
      options: { layout: "full", imageSide: "right", focal: "center", align: "center", height: "standard" },
    }),
    createBlock("richText", {
      id: "s_3",
      label: "Rich text",
      anchor: "intro",
      content: {
        heading: "Structured text",
        blocks: [
          {
            kind: "paragraph",
            text: "Paragraphs support safe inline links such as [the B Platform plans](#pricing). No raw HTML is ever rendered.",
          },
          { kind: "bullets", text: "Bulleted lists\nOne item per line\nKeyboard friendly" },
          { kind: "numbered", text: "Write\nSubmit for review\nPublish after approval" },
        ],
      },
      options: { textWidth: "narrow", align: "left" },
    }),
    createBlock("imageText", {
      id: "s_4",
      label: "Image and text",
      content: {
        heading: "Image and text",
        text: "Image side, ratio and alignment are configurable. Stacks on small screens.",
        image: img(11),
        alt: "Abstract composition",
        buttonLabel: "Contact",
        buttonHref: "#contact",
      },
      options: { imageSide: "right", ratio: "3/2", align: "left" },
    }),
    createBlock("services", {
      id: "s_5",
      label: "Services",
      anchor: "services",
      content: {
        heading: "Service grid",
        intro: "Two or three columns, simple or outlined.",
        items: [
          { title: "Strategy", summary: "Sample summary.", icon: "compass" },
          { title: "Design", summary: "Sample summary.", icon: "briefcase" },
          {
            title: "Delivery",
            summary: "Sample summary.",
            icon: "chart",
            linkLabel: "Learn more",
            linkUrl: "#faq",
          },
        ],
      },
      options: { columns: "3", cardStyle: "outlined" },
    }),
    createBlock("showcase", {
      id: "s_6",
      label: "Showcase",
      content: {
        heading: "Showcase",
        items: [1, 2, 3].map((n) => ({
          name: `Sample item ${n}`,
          image: img(30 + n),
          alt: `Sample item ${n}`,
          description: "Short description.",
          category: n % 2 ? "Category A" : "Category B",
          price: `${n * 10} USD`,
          url: "",
        })),
      },
      options: { columns: "3", showPrices: true, crop: "4/3" },
    }),
    createBlock("gallery", {
      id: "s_7",
      label: "Gallery",
      anchor: "gallery",
      content: {
        heading: "Photo gallery",
        images: [1, 2, 3, 4, 5, 6].map((n) => ({ src: img(40 + n), alt: `Abstract artwork ${n}`, caption: `Composition ${n}` })),
      },
      options: { columns: "3", ratio: "4/3", captions: true },
    }),
    createBlock("hours", {
      id: "s_8",
      label: "Hours",
      content: {
        heading: "Opening hours (sample)",
        days: [
          ...["1", "2", "3", "4", "5"].map((day) => ({
            day,
            closed: false,
            windows: [{ open: "09:00", close: "13:00" }, { open: "14:00", close: "18:00" }],
          })),
          { day: "6", closed: false, windows: [{ open: "10:00", close: "14:00" }] },
          { day: "0", closed: true, windows: [] },
        ],
        exceptions: [{ date: "2026-12-31", closed: true, open: "", close: "", label: "New Year's Eve" }],
        note: "Sample hours, not real.",
      },
      options: { timezone: "Asia/Yerevan", clock: "24", showClosed: true },
    }),
    createBlock("cta", {
      id: "s_9",
      label: "CTA",
      content: {
        heading: "Call-to-action strip",
        text: "Neutral or accent, split or centered.",
        primaryLabel: "Primary",
        primaryHref: "#contact",
        secondaryLabel: "",
        secondaryHref: "",
      },
      options: { ctaTone: "neutral", alignment: "center" },
    }),
    createBlock("testimonials", {
      id: "s_10",
      label: "Testimonials",
      content: {
        heading: "Testimonials (sample)",
        items: [
          {
            quote: "Placeholder quote for layout demonstration only.",
            name: "Sample Person",
            role: "Role",
            portrait: portraitArt("SP", 1),
          },
          { quote: "Another placeholder quote.", name: "Example Name", role: "Role" },
        ],
      },
      options: { columns: "2", style: "bordered" },
    }),
    createBlock("team", {
      id: "s_11",
      label: "Team",
      content: {
        heading: "Team grid",
        items: [
          {
            name: "Ani Sample",
            role: "Lead",
            bio: "Fictional bio.",
            portrait: portraitArt("AS", 0),
            alt: "Illustrated portrait",
          },
          { name: "Davit Example", role: "Advisor", bio: "No portrait — name stays visible." },
          {
            name: "Mari Demo",
            role: "Analyst",
            bio: "Fictional bio.",
            portrait: portraitArt("MD", 2),
            alt: "Illustrated portrait",
          },
        ],
      },
      options: { columns: "3", crop: "1/1", shape: "circle" },
    }),
    createBlock("logos", {
      id: "s_12",
      label: "Logos",
      content: {
        heading: "Logo strip",
        items: ["Northwind", "Ararat Labs", "Kite & Co", "Delta"].map((n, i) => ({ logo: logoArt(n, i), name: n, url: "" })),
      },
      options: { color: "grayscale", density: "relaxed", wrap: true },
    }),
    createBlock("pricing", {
      id: "s_13",
      label: "Pricing",
      anchor: "pricing",
      content: {
        heading: "Packages",
        items: [
          {
            name: "Basic",
            price: "From 100 USD",
            description: "Sample package.",
            inclusions: "One thing\nAnother thing",
            featured: false,
          },
          {
            name: "Plus",
            price: "From 200 USD",
            description: "Featured sample.",
            inclusions: "Everything in Basic\nMore",
            featured: true,
            actionLabel: "Ask",
            actionHref: "#contact",
          },
          {
            name: "Max",
            price: "On request",
            description: "Sample.",
            inclusions: "All of it",
            featured: false,
          },
        ],
      },
      options: { columns: "3" },
    }),
    createBlock("video", {
      id: "s_14",
      label: "Video",
      content: {
        title: "Video embed",
        url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
        poster: img(60),
        alt: "Abstract poster",
        transcript: "",
      },
      options: { aspect: "16/9", clickToPlay: true },
    }),
    createBlock("carousel", {
      id: "s_15",
      label: "Carousel",
      content: {
        heading: "Carousel",
        slides: [1, 2, 3].map((n) => ({
          image: img(70 + n),
          alt: `Slide ${n}`,
          caption: `Slide ${n} caption`,
          actionLabel: "",
          actionHref: "",
        })),
      },
      options: { arrows: true, dots: true, loop: true, autoplay: false, delay: 5 },
    }),
    createBlock("faq", {
      id: "s_16",
      label: "FAQ",
      anchor: "faq",
      content: {
        heading: "FAQ",
        items: [
          {
            question: "Is this a real company?",
            answer: "No. This is a fictional sample for demonstrating blocks.",
          },
          { question: "Can BFO use these blocks?", answer: "Only blocks included in their current $4 plan." },
        ],
      },
      options: { mode: "single", initialOpen: 0 },
    }),
    createBlock("tabs", {
      id: "s_17",
      label: "Tabs",
      content: {
        heading: "Tabbed content",
        tabs: [
          {
            label: "Overview",
            title: "Overview",
            text: "First panel.\n\n- Arrow keys switch tabs\n- Home/End jump",
          },
          { label: "Details", title: "Details", text: "Second panel." },
          { label: "Notes", title: "Notes", text: "Third panel." },
        ],
      },
      options: { initial: 1, mobile: "stacked" },
    }),
    createBlock("metrics", {
      id: "s_18",
      label: "Metrics",
      content: {
        heading: "Animated metrics (sample values)",
        items: [
          { value: 20, prefix: "", suffix: "", label: "Block types" },
          { value: 3, prefix: "", suffix: "", label: "Plan tiers" },
          { value: 100, prefix: "", suffix: "%", label: "Keyboard accessible" },
        ],
      },
      options: { columns: "3", countUp: true, duration: 1.5 },
    }),
    createBlock("timeline", {
      id: "s_19",
      label: "Timeline",
      content: {
        heading: "Timeline or steps",
        items: [
          { title: "Draft", description: "Edit content privately.", date: "" },
          { title: "Review", description: "Submit for approval.", date: "" },
          { title: "Live", description: "Approved snapshot becomes public.", date: "" },
        ],
      },
      options: { mode: "steps", reveal: true },
    }),
    createBlock("contact", {
      id: "s_20",
      label: "Contact",
      anchor: "contact",
      content: {
        heading: "Contact (sample)",
        intro: "Fictional contact block.",
        addresses: [{ label: "Studio", address: "Sample street 1, Sample City" }],
        phones: [],
        email: "hello@example.com",
        mapUrl: "",
        links: [],
      },
      options: {
        layout: "stacked",
        order: "email",
        showAddress: true,
        showPhone: true,
        showEmail: true,
        showMap: true,
      },
    }),
  ];
}
export function seedSample(): CompanyRecord {
  const layout: LayoutSettings = {
    theme: "slate",
    accent: "#2e4a62",
    background: "#eef0f2",
    logoUrl: "",
    logoAlt: "",
    showContact: true,
    contactEmail: "hello@example.com",
    contactPhone: "",
    contactAddress: "",
    text: Object.fromEntries((["hy", "en", "ru"] as Locale[]).map((l) => [
      l,
      {
        displayName: "Sample Studio ($10 demo)",
        nav: [
          { label: "Services", anchor: "services" },
          { label: "Gallery", anchor: "gallery" },
          { label: "Pricing", anchor: "pricing" },
          { label: "FAQ", anchor: "faq" },
          { label: "Contact", anchor: "contact" },
        ],
        ctaLabel: "Contact",
        ctaHref: "#contact",
        footerLinks: [{ label: "BFO page", url: "/1" }],
        copyright: "Fictional sample company",
      },
    ])) as Record<Locale, LayoutText>,
  };
  const page = samplePage();
  const pages = { hy: page, en: page, ru: page };
  return {
    id: "2",
    name: "Sample Studio ($10 demo)",
    plan: "10",
    sample: true,
    ...createSnapshots(layout, pages),
    status: "approved",
    savedAt: null,
    submittedAt: null,
  };
}
