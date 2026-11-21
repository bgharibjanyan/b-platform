import { fieldRecords, fieldText } from "../../field-values";
import { companyLabels } from "../../locale-labels";
import { BlockHeading, BlockLink, Paragraphs } from "../shared/shared";
import type { BlockProps } from "../types";

export function ContactBlock({ content, options, locale }: BlockProps) {
  const email = fieldText(content.email);
  const mapUrl = fieldText(content.mapUrl);
  const phones = fieldRecords(content.phones).map(phone => ({
    label: fieldText(phone.label) || fieldText(phone.number),
    url: `tel:${fieldText(phone.number) ?? ""}`,
  }));

  const actions = [
    { type: "email", links: options.showEmail && email ? [{ label: email, url: "mailto:" + email }] : [] },
    { type: "phone", links: options.showPhone ? phones : [] },
    { type: "map", links: options.showMap && mapUrl ? [{ label: companyLabels[locale].directions, url: mapUrl }] : [] },
  ];
  actions.sort((first, second) => Number(second.type === options.order) - Number(first.type === options.order));

  const links = [...actions.flatMap(action => action.links), ...fieldRecords(content.links)];
  const className = options.layout === "split" ? "co-contact co-split" : "co-contact";

  return (
    <div className={className}>
      <div>
        <BlockHeading value={content.heading} />
        <Paragraphs value={content.intro} />
        {Boolean(options.showAddress) && fieldRecords(content.addresses).map((address, index) => {
          const label = fieldText(address.label);
          return (
            <address key={index}>
              {label && <strong>{label} · </strong>}
              {fieldText(address.address)}
            </address>
          );
        })}
      </div>
      <div className="co-link-list">
        {links.map((link, index) => <BlockLink key={index} to={link.url} button>{fieldText(link.label)}</BlockLink>)}
      </div>
    </div>
  );
}
