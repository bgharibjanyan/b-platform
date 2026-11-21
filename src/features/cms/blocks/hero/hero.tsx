import { fieldText } from "../../field-values";
import { BlockImage, BlockLink, Paragraphs } from "../shared/shared";
import type { BlockProps } from "../types";

export function HeroBlock({ content, options, example }: BlockProps) {
  const Heading = example ? "h3" : "h1";
  const eyebrow = fieldText(content.eyebrow);
  const layout = options.layout === "full" ? "co-hero-cover" : "co-split";
  const side = options.imageSide === "left" ? " co-image-left" : "";
  const height = fieldText(options.height) ?? "standard";
  const align = options.align === "center" ? "center" : "left";

  return (
    <div className={`co-hero ${layout} co-height-${height}${side}`} data-align={align} style={{ textAlign: align }}>
      <div className="co-hero-copy">
        {eyebrow && <span className="co-eyebrow">{eyebrow}</span>}
        <Heading className="co-hero-title">{fieldText(content.heading)}</Heading>
        <Paragraphs value={content.intro} />
        <BlockLink to={content.actionHref} button>{fieldText(content.actionLabel)}</BlockLink>
      </div>
      <BlockImage priority source={content.image} alt={content.alt} style={{ objectPosition: fieldText(options.focal) }} />
    </div>
  );
}
