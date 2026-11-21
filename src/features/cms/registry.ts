import type { Block } from "./types";
import type { BlockDefinition } from "./definitions/types";
import { heroDefinition } from "./blocks/hero/definition";
import { richTextDefinition } from "./blocks/rich-text/definition";
import { bannerDefinition } from "./blocks/banner/definition";
import { imageTextDefinition } from "./blocks/image-text/definition";
import { servicesDefinition } from "./blocks/services/definition";
import { showcaseDefinition } from "./blocks/showcase/definition";
import { galleryDefinition } from "./blocks/gallery/definition";
import { hoursDefinition } from "./blocks/hours/definition";
import { contactDefinition } from "./blocks/contact/definition";
import { ctaDefinition } from "./blocks/cta/definition";
import { testimonialsDefinition } from "./blocks/testimonials/definition";
import { teamDefinition } from "./blocks/team/definition";
import { logosDefinition } from "./blocks/logos/definition";
import { pricingDefinition } from "./blocks/pricing/definition";
import { videoDefinition } from "./blocks/video/definition";
import { carouselDefinition } from "./blocks/carousel/definition";
import { faqDefinition } from "./blocks/faq/definition";
import { tabsDefinition } from "./blocks/tabs/definition";
import { metricsDefinition } from "./blocks/metrics/definition";
import { timelineDefinition } from "./blocks/timeline/definition";

export const REGISTRY = [
  heroDefinition,
  richTextDefinition,
  bannerDefinition,
  imageTextDefinition,
  servicesDefinition,
  showcaseDefinition,
  galleryDefinition,
  hoursDefinition,
  contactDefinition,
  ctaDefinition,
  testimonialsDefinition,
  teamDefinition,
  logosDefinition,
  pricingDefinition,
  videoDefinition,
  carouselDefinition,
  faqDefinition,
  tabsDefinition,
  metricsDefinition,
  timelineDefinition,
] as const satisfies readonly BlockDefinition[];

export type BlockType = typeof REGISTRY[number]["type"];
const definitions = new Map<string, BlockDefinition>(REGISTRY.map(definition => [definition.type, definition]));

export function getDef(type: string): BlockDefinition | undefined {
  return definitions.get(type);
}

let counter = 0;
export function newId() {
  counter += 1;
  return `b_${Date.now().toString(36)}_${counter}_${Math.random().toString(36).slice(2, 6)}`;
}

export function createBlock(type: string, overrides: Partial<Block> = {}): Block {
  const def = getDef(type);
  if (!def) throw new Error(`Unknown block type ${type}`);
  const defaults = def.defaults();
  return {
    id: overrides.id ?? newId(),
    type,
    label: def.name,
    hidden: false,
    anchor: "",
    spacing: "normal",
    width: "standard",
    tone: "default",
    ...overrides,
    content: { ...defaults.content, ...(overrides.content ?? {}) },
    options: { ...defaults.options, ...(overrides.options ?? {}) },
  };
}
