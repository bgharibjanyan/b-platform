import { BlockLink } from "../../blocks/shared/shared";
import type { LayoutSettings, Locale } from "../../types";

export function CompanyFooter({ layout, locale }: { layout: LayoutSettings; locale: Locale }) {
  const settings = layout.text[locale];

  return (
    <footer className="co-footer">
      <div className="co-footer-inner">
        <div>
          <strong>{settings.displayName}</strong>
          {settings.copyright && <small>{settings.copyright}</small>}
        </div>
        <div className="co-link-list">
          {settings.footerLinks.map((link, index) => <BlockLink key={index} to={link.url}>{link.label}</BlockLink>)}
        </div>
        {layout.showContact && (
          <address>
            <BlockLink to={layout.contactEmail && `mailto:${layout.contactEmail}`}>{layout.contactEmail}</BlockLink>
            <BlockLink to={layout.contactPhone && `tel:${layout.contactPhone}`}>{layout.contactPhone}</BlockLink>
            <span>{layout.contactAddress}</span>
          </address>
        )}
      </div>
    </footer>
  );
}
