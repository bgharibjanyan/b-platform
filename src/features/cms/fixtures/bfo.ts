import { bfoHeroAlt, bfoHeroImage, bfoStoryAlt, bfoStoryImage } from "./bfo-media";
import { createBlock } from "../registry";
import type { Block, CompanyRecord, LayoutText, Locale } from "../types";
import { BFO_COPY } from "./bfo-copy";
import { createSnapshots } from "./snapshots";

const brand = "BFO Consulting Group";
const email = "general@bfo.am";
const phone = "+374 93 169977";
const mail = "mailto:" + email;
const call = "tel:+37493169977";
const map = "https://www.google.com/maps/search/?api=1&query=8%20Vardanants%20Blind%20Alley%2C%20Yerevan%2C%20Armenia";
const site = "https://bfo.am/";
const linkedIn = "https://www.linkedin.com/company/bfo-consulting-armenia/";

function page(locale: Locale): Block[] {
  const c = BFO_COPY[locale];
  return [
    createBlock("hero", {
      id: "bfo-hero", anchor: "top", width: "wide", spacing: "relaxed",
      content: { eyebrow: c.eyebrow, heading: c.hero, intro: c.intro, image: bfoHeroImage, alt: bfoHeroAlt[locale], actionLabel: c.discover, actionHref: "#services" },
      options: { layout: "full", focal: "right", height: "tall" },
    }),
    createBlock("services", {
      id: "bfo-services", anchor: "services", width: "wide",
      content: { heading: c.services, intro: c.servicesIntro, items: c.offerings.map(([title, summary, icon]) => ({ title, summary, icon })) },
      options: { columns: "3", cardStyle: "outlined" },
    }),
    createBlock("imageText", {
      id: "bfo-about", anchor: "about", tone: "muted",
      content: { heading: c.about, text: c.aboutText, image: bfoStoryImage, alt: bfoStoryAlt[locale], buttonLabel: c.website, buttonHref: site },
      options: { imageSide: "left", ratio: "4/3" },
    }),
    createBlock("services", {
      id: "bfo-process", anchor: "process", width: "wide", tone: "ink",
      content: { heading: c.process, items: c.steps.map(([title, summary], index) => ({ title: (index + 1) + ". " + title, summary })) },
      options: { columns: "3", cardStyle: "simple" },
    }),
    createBlock("contact", {
      id: "bfo-contact", anchor: "contact", width: "wide",
      content: {
        heading: c.contact, intro: c.contactIntro, addresses: [{ address: c.address }],
        phones: [{ number: phone }], email, mapUrl: map, links: [{ label: "LinkedIn", url: linkedIn }],
      },
    }),
  ];
}

function text(locale: Locale): LayoutText {
  const c = BFO_COPY[locale];
  const nav = {
    en: ["Services", "About", "How we work", "Contact"],
    hy: ["Ծառայություններ", "Մեր մասին", "Ինչպես ենք աշխատում", "Կապ"],
    ru: ["Услуги", "О компании", "Как мы работаем", "Контакты"],
  }[locale];
  return {
    displayName: brand, ctaLabel: c.write, ctaHref: mail, copyright: "© " + brand,
    nav: ["services", "about", "process", "contact"].map((anchor, index) => ({ label: nav[index], anchor })),
    footerLinks: [{ label: c.website, url: site }, { label: c.call, url: call }, { label: "LinkedIn", url: linkedIn }],
  };
}

export function seedBfo(): CompanyRecord {
  return {
    id: "1", name: brand, plan: "4", sample: false, status: "approved", savedAt: null, submittedAt: null,
    ...createSnapshots({
      theme: "editorial", accent: "#164d3e", background: "#f8f4ea",
      logoUrl: "", logoAlt: "", showContact: true,
      contactEmail: email, contactPhone: phone, contactAddress: BFO_COPY.hy.address,
      text: { hy: text("hy"), en: text("en"), ru: text("ru") },
    }, { hy: page("hy"), en: page("en"), ru: page("ru") }),
  };
}
