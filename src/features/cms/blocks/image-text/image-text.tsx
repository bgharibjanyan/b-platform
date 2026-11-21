import { fieldText } from "../../field-values";
import { BlockHeading, BlockImage, BlockLink, Paragraphs } from "../shared/shared";
import type { BlockProps } from "../types";

export function ImageTextBlock({ content, options }: BlockProps) {
  const className = options.imageSide === "left" ? "co-split co-image-left" : "co-split";

  return (
    <div className={className} style={{ textAlign: options.align === "center" ? "center" : "left" }}>
      <div>
        <BlockHeading value={content.heading} />
        <Paragraphs value={content.text} />
        <BlockLink to={content.buttonHref} button>{fieldText(content.buttonLabel)}</BlockLink>
      </div>
      <BlockImage source={content.image} alt={content.alt} style={{ aspectRatio: fieldText(options.ratio) }} />
    </div>
  );
}
