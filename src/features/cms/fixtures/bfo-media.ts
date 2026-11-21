import { abstractArt } from "../art";
import type { Block, Locale } from "../types";

const heroAlt: Record<Locale, string> = {
  hy: "Երեկոյան լույսով լուսավորված հանդիպումների սրահ և մուգ փայտե սեղան",
  en: "A dark wood meeting table in a sunlit studio",
  ru: "Стол из тёмного дерева в освещённой солнцем переговорной",
};

const storyAlt: Record<Locale, string> = {
  hy: "Նոթատետր և թուղթ՝ պատուհանից ընկնող լույսի մեջ",
  en: "A notebook and paper in warm window light",
  ru: "Блокнот и бумага в тёплом свете из окна",
};

export const bfoHeroImage = "/company-media/bfo-advisory-studio.webp";
export const bfoStoryImage = "/company-media/bfo-materials.webp";
export { heroAlt as bfoHeroAlt, storyAlt as bfoStoryAlt };

const legacyHero = abstractArt(7, { palette: 0 });
const legacyStory = abstractArt(21, { palette: 1 });

// Existing demo snapshots still reference these original stock illustrations.
export function resolveBfoStockMedia(block: Block, locale: Locale): Block {
  if (block.type === "hero" && block.id === "hero_" + locale && block.content.image === legacyHero) {
    const { layout, imageSide, focal, align, height } = block.options;
    const stockLayout = layout === "split" && imageSide === "right" && focal === "center" && align === "left" && height === "tall";
    return {
      ...block,
      content: { ...block.content, image: bfoHeroImage, alt: heroAlt[locale] },
      options: stockLayout ? { ...block.options, layout: "full", focal: "right" } : block.options,
    };
  }

  if (block.type === "imageText" && block.id === "about_" + locale && block.content.image === legacyStory) {
    return { ...block, content: { ...block.content, image: bfoStoryImage, alt: storyAlt[locale] } };
  }

  return block;
}
