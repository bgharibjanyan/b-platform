import type { CSSProperties, RefObject } from "react";
import { isBannerVisible } from "../../blocks/banner/banner";
import { BlockSection } from "../../blocks/block-section/block-section";
import { CompanyFooter } from "../company-footer/company-footer";
import { CompanyHeader } from "../company-header/company-header";
import { isEntitled } from "../../plans";
import { resolveBfoStockMedia } from "../../fixtures/bfo-media";
import { getDef } from "../../registry";
import type { Block, Locale, Plan, Snapshot } from "../../types";

interface CompanyPageProps {
  companyId: string;
  snapshot: Snapshot;
  plan: Plan;
  locale: Locale;
  changeLocale: (locale: Locale) => void;
  scrollContainer?: RefObject<HTMLDivElement | null>;
}

function isVisible(block: Block, plan: Plan) {
  const definition = getDef(block.type);
  if (!definition || !isEntitled(plan, definition.plan) || block.hidden) return false;

  return block.type !== "banner" || isBannerVisible(block.content);
}

function isTopBanner(block: Block) {
  return block.type === "banner" && block.options.placement === "top";
}

function accentText(hex: string) {
  const channels = hex.slice(1).match(/.{2}/g)?.map(channel => {
    const value = Number.parseInt(channel, 16) / 255;
    return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
  });
  const luminance = channels ? channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722 : 0;
  return luminance > .179 ? "#000" : "#fff";
}

export function CompanyPage({ companyId, snapshot, plan, locale, changeLocale, scrollContainer }: CompanyPageProps) {
  const { layout } = snapshot;
  const blocks = snapshot.pages[locale].filter(block => isVisible(block, plan));
  const navigation = layout.text[locale].nav.filter(item => blocks.some(block => block.anchor === item.anchor));
  const ordered = [...blocks.filter(isTopBanner), ...blocks.filter(block => !isTopBanner(block))];
  const accent = /^#[0-9a-f]{6}$/i.test(layout.accent) ? layout.accent : "#284638";
  const colors = {
    "--co-accent": accent,
    "--co-button-text": accentText(accent),
    "--co-bg": layout.background || "#f8f6ee",
  } as CSSProperties;

  return (
    <div id="company-top" className={`company-surface co-theme-${layout.theme}`} style={colors} lang={locale}>
      <CompanyHeader layout={layout} navigation={navigation} locale={locale} changeLocale={changeLocale} scrollContainer={scrollContainer} />
      <div className="co-content">
        {ordered.map(block => <BlockSection key={block.id} block={companyId === "1" ? resolveBfoStockMedia(block, locale) : block} locale={locale} />)}
      </div>
      <CompanyFooter layout={layout} locale={locale} />
    </div>
  );
}
