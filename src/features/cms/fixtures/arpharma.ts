import { createBlock } from "../registry";
import type { Block, CompanyRecord, LayoutText, Locale } from "../types";
import { ARPHARMA_COPY } from "./arpharma-copy";
import { createSnapshots } from "./snapshots";

const brand = "Arpharma";
const email = "arpharma2017@gmail.com";
const seller = "https://www.wildberries.ru/seller/4567840";
const productImages = ["rounds", "swabs", "travel"].map(name => "/company-media/arpharma-" + name + ".webp");
const facebook = "https://www.facebook.com/share/1DkWdPUrXM/";
const map = "https://www.google.com/maps/search/?api=1&query=14%20Nikoghayos%20Tigranyan%20Street%2C%20Yerevan%2C%20Armenia";

function page(locale: Locale): Block[] {
  const c = ARPHARMA_COPY[locale];
  return [
    createBlock("hero", {
      id: "arpharma-hero", anchor: "top", width: "wide", spacing: "relaxed",
      content: { eyebrow: c.eyebrow, heading: c.hero, intro: c.intro, image: "/company-media/arpharma-hero.webp", alt: c.heroAlt, actionLabel: c.catalog, actionHref: "#catalogue" },
      options: { layout: "split", height: "standard" },
    }),
    createBlock("richText", {
      id: "arpharma-catalogue", anchor: "catalogue", width: "wide", tone: "muted",
      content: { heading: c.examples, blocks: [{ kind: "paragraph", text: c.sampleNote }] },
      options: { textWidth: "standard" },
    }),
    createBlock("showcase", {
      id: "arpharma-products", width: "wide", spacing: "compact",
      content: { heading: "", items: c.products.map(([name, description], index) => ({ name, description, image: productImages[index], alt: c.productAlts[index] })) },
      options: { columns: "3", showPrices: false, crop: "4/3" },
    }),
    createBlock("cta", {
      id: "arpharma-seller", anchor: "order", width: "wide",
      content: { heading: c.order, text: c.orderText, primaryLabel: c.seller, primaryHref: seller, secondaryLabel: c.email, secondaryHref: "mailto:" + email },
      options: { ctaTone: "accent", alignment: "split" },
    }),
    createBlock("contact", {
      id: "arpharma-contact", anchor: "contact", width: "wide",
      content: { heading: c.contact, intro: c.contactText, addresses: [{ address: c.address }], email, mapUrl: map, links: [{ label: "Facebook", url: facebook }] },
      options: { showPhone: false },
    }),
  ];
}

function text(locale: Locale): LayoutText {
  const c = ARPHARMA_COPY[locale];
  const names = { hy: "Արֆարմա", en: brand, ru: "Арфарма" };
  const nav = {
    en: ["Catalogue", "Where to buy", "Contact"],
    hy: ["Կատալոգ", "Որտեղ գնել", "Կապ"],
    ru: ["Каталог", "Где купить", "Контакты"],
  }[locale];
  return {
    displayName: names[locale], ctaLabel: c.seller, ctaHref: seller, copyright: "© " + names[locale],
    nav: ["catalogue", "order", "contact"].map((anchor, index) => ({ label: nav[index], anchor })),
    footerLinks: [{ label: "Wildberries", url: seller }, { label: "Facebook", url: facebook }, { label: c.email, url: "mailto:" + email }],
  };
}

export function seedArpharma(): CompanyRecord {
  return {
    id: "3", name: brand, plan: "4", sample: false, status: "approved", savedAt: null, submittedAt: null,
    ...createSnapshots({
      theme: "editorial", accent: "#38645a", background: "#eff8f4",
      logoUrl: "", logoAlt: "", showContact: true,
      contactEmail: email, contactPhone: "", contactAddress: ARPHARMA_COPY.hy.address,
      text: { hy: text("hy"), en: text("en"), ru: text("ru") },
    }, { hy: page("hy"), en: page("en"), ru: page("ru") }),
  };
}
