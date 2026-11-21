import type { Locale } from "@/features/cms/types";

export const HOME_LOCALES = ["hy", "en", "ru"] as const satisfies readonly Locale[];

export const HOME_LANGUAGES = {
  hy: { name: "Հայերեն", short: "ՀԱՅ", path: "/hy/" },
  en: { name: "English", short: "EN", path: "/" },
  ru: { name: "Русский", short: "РУ", path: "/ru/" },
} satisfies Record<Locale, { name: string; short: string; path: string }>;

export function isHomeLocale(value: unknown): value is Locale {
  return HOME_LOCALES.some(locale => locale === value);
}

export const HOME_FIELDS = {
  meta: { title: "Page title", description: "Search and sharing description" },
  nav: { services: "Services link", guide: "Usage guide link", companies: "Companies link", plans: "Plans link", start: "Subscription link", language: "Language switcher label", menu: "Mobile menu label", skip: "Skip link" },
  hero: { eyebrow: "Kicker", title: "Headline", highlight: "Gradient headline", description: "Introduction", browse: "Primary button", guide: "Secondary button", visualCaption: "Product preview caption" },
  services: { eyebrow: "Kicker", title: "Heading", description: "Introduction", pageTitle: "Company page title", pageText: "Company page description", discoveryTitle: "Directory title", discoveryText: "Directory description", contactTitle: "Contact title", contactText: "Contact description", sampleBrand: "Illustrative page name", sampleCategory: "Illustrative page category" },
  guide: { eyebrow: "Kicker", title: "Heading", description: "Introduction", firstTitle: "First step title", firstText: "First step description", secondTitle: "Second step title", secondText: "Second step description", thirdTitle: "Third step title", thirdText: "Third step description", cta: "Button" },
  companies: { eyebrow: "Kicker", title: "Heading", description: "Introduction", featured: "Featured label", directory: "Directory heading", search: "Search field label", placeholder: "Search placeholder", none: "No published companies", noMatches: "No search results", view: "Company page link", previous: "Previous button label", next: "Next button label" },
  plans: { eyebrow: "Kicker", title: "Heading", description: "Introduction", standard: "Standard name", standardText: "Standard description", standardOne: "Standard feature 1", standardTwo: "Standard feature 2", standardThree: "Standard feature 3", enhanced: "Enhanced name", enhancedText: "Enhanced description", enhancedOne: "Enhanced feature 1", enhancedTwo: "Enhanced feature 2", enhancedThree: "Enhanced feature 3", custom: "Custom name", customText: "Custom description", customOne: "Custom feature 1", customTwo: "Custom feature 2", customThree: "Custom feature 3", cta: "Plan button" },
  faq: { eyebrow: "Kicker", title: "Heading", firstQuestion: "First question", firstAnswer: "First answer", secondQuestion: "Second question", secondAnswer: "Second answer", thirdQuestion: "Third question", thirdAnswer: "Third answer", fourthQuestion: "Fourth question", fourthAnswer: "Fourth answer" },
  contact: { eyebrow: "Kicker", title: "Heading", description: "Introduction", cta: "Email button", subject: "Email subject", footer: "Footer description", powered: "Footer credit" },
} as const;

export type HomeSection = keyof typeof HOME_FIELDS;
export type HomeCopy = { [Section in HomeSection]: { [Field in keyof (typeof HOME_FIELDS)[Section]]: string } };
export const HOME_SECTIONS = Object.keys(HOME_FIELDS) as HomeSection[];
export const HOME_SECTION_LABELS: Record<HomeSection, string> = {
  meta: "Search and sharing", nav: "Navigation", hero: "Hero", services: "Services", guide: "Usage guide",
  companies: "Companies", plans: "Plans", faq: "Questions and answers", contact: "Contact and footer",
};

export function homeFields(section: HomeSection) {
  return Object.entries(HOME_FIELDS[section]).map(([field, label]) => ({
    field,
    label,
    maxLength: section === "meta" && field === "description" ? 180
      : /(?:Text|Answer|description|footer)$/.test(field) ? 480 : 110,
    multiline: /(?:Text|Answer|description|footer)$/.test(field),
  }));
}

export const MAX_FEATURED = 8;

export const DEFAULT_HOME_SETTINGS = { contactEmail: "general@bfo.am", featuredIds: ["1"] };

export type HomeSettings = typeof DEFAULT_HOME_SETTINGS;

export function validHomeEmail(value: string) {
  return value.length <= 254 && /^[a-z0-9.!#$%&'*+/=^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(value);
}

export function subscriptionHref(email: string, subject: string) {
  const recipient = encodeURIComponent(email).replace("%40", "@");
  return "mailto:" + recipient + "?subject=" + encodeURIComponent(subject);
}
