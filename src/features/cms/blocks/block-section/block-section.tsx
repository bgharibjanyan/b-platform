import type { ComponentType } from "react";
import type { BlockType } from "../../registry";
import type { Block, Locale } from "../../types";
import { HeroBlock } from "../hero/hero";
import { RichTextBlock } from "../rich-text/rich-text";
import { BannerBlock } from "../banner/banner";
import { ImageTextBlock } from "../image-text/image-text";
import { ServicesBlock } from "../services/services";
import { ShowcaseBlock } from "../showcase/showcase";
import { GalleryBlock } from "../gallery/gallery";
import { HoursBlock } from "../hours/hours";
import { ContactBlock } from "../contact/contact";
import { CtaBlock } from "../cta/cta";
import { TestimonialsBlock } from "../testimonials/testimonials";
import { TeamBlock } from "../team/team";
import { LogosBlock } from "../logos/logos";
import { PricingBlock } from "../pricing/pricing";
import { VideoBlock } from "../video/video";
import { CarouselBlock } from "../carousel/carousel";
import { FaqBlock } from "../faq/faq";
import { TabsBlock } from "../tabs/tabs";
import { MetricsBlock } from "../metrics/metrics";
import { TimelineBlock } from "../timeline/timeline";
import type { BlockProps } from "../types";

const renderers: Record<BlockType, ComponentType<BlockProps>> = {
  hero: HeroBlock,
  richText: RichTextBlock,
  banner: BannerBlock,
  imageText: ImageTextBlock,
  services: ServicesBlock,
  showcase: ShowcaseBlock,
  gallery: GalleryBlock,
  hours: HoursBlock,
  contact: ContactBlock,
  cta: CtaBlock,
  testimonials: TestimonialsBlock,
  team: TeamBlock,
  logos: LogosBlock,
  pricing: PricingBlock,
  video: VideoBlock,
  carousel: CarouselBlock,
  faq: FaqBlock,
  tabs: TabsBlock,
  metrics: MetricsBlock,
  timeline: TimelineBlock,
};

function isBlockType(type: string): type is BlockType {
  return Object.hasOwn(renderers, type);
}

export function BlockSection({ block, locale, example }: { block: Block; locale: Locale; example?: boolean }) {
  if (!isBlockType(block.type)) return null;

  const Renderer = renderers[block.type];
  const className = `co-section co-width-${block.width} co-space-${block.spacing} co-tone-${block.tone}`;

  return (
    <section id={block.anchor || undefined} data-block={block.type} className={className}>
      <div className="co-inner">
        <Renderer content={block.content} options={block.options} locale={locale} example={example} />
      </div>
    </section>
  );
}
