import { fieldRecords, fieldText } from "../../field-values";
import { BlockGrid, BlockHeading, BlockImage, BlockLink, Paragraphs } from "../shared/shared";
import type { BlockProps } from "../types";

const serviceIcons = new Map([
  ["ledger", "▤"], ["percent", "%"], ["chart", "◩"], ["scale", "◇"],
  ["compass", "◈"], ["users", "◉"], ["cpu", "⊞"], ["briefcase", "▣"],
]);

export function ServicesBlock({ content, options }: BlockProps) {
  const cardClass = options.cardStyle === "outlined" ? "co-card co-bordered" : "co-card";

  return (
    <div className="co-services">
      <div className="co-service-intro">
        <BlockHeading value={content.heading} />
        <div className="co-service-description"><Paragraphs value={content.intro} /></div>
      </div>
      <BlockGrid columns={options.columns}>
        {fieldRecords(content.items).map((item, index) => {
          const icon = fieldText(item.icon);
          return (
            <article className={cardClass} key={index}>
              <BlockImage source={item.image} />
              {icon && (
                <span className={`co-service-icon icon-${icon}`} aria-hidden="true">
                  {serviceIcons.get(icon) ?? "·"}
                </span>
              )}
              <h3>{fieldText(item.title)}</h3>
              <p>{fieldText(item.summary)}</p>
              <BlockLink to={item.linkUrl}>{fieldText(item.linkLabel)}</BlockLink>
            </article>
          );
        })}
      </BlockGrid>
    </div>
  );
}
