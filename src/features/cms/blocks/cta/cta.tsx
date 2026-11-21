import { fieldText } from "../../field-values";
import { BlockHeading, BlockLink, Paragraphs } from "../shared/shared";
import type { BlockProps } from "../types";

export function CtaBlock({ content, options }: BlockProps) {
  const tone = fieldText(options.ctaTone) ?? "accent";
  const alignment = fieldText(options.alignment) ?? "split";

  return (
    <div className={`co-cta co-cta-${tone} co-cta-${alignment}`}>
      <div>
        <BlockHeading value={content.heading} />
        <Paragraphs value={content.text} />
      </div>
      <div className="co-controls">
        <BlockLink to={content.primaryHref} button>{fieldText(content.primaryLabel)}</BlockLink>
        <BlockLink to={content.secondaryHref} button>{fieldText(content.secondaryLabel)}</BlockLink>
      </div>
    </div>
  );
}
