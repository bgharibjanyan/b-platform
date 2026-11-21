import { fieldText } from "../../field-values";
import type { FieldValues } from "../../types";
import { BlockLink } from "../shared/shared";
import type { BlockProps } from "../types";

export function isBannerVisible(content: FieldValues): boolean {
  return Boolean(content.enabled && fieldText(content.message));
}

export function BannerBlock({ content, options }: BlockProps) {
  if (!isBannerVisible(content)) return null;

  return (
    <div className={`co-banner co-banner-${fieldText(options.bannerTone) ?? "info"}`}>
      <p>{fieldText(content.message)}</p>
      <BlockLink to={content.linkUrl}>{fieldText(content.linkLabel)}</BlockLink>
    </div>
  );
}
