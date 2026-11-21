import { fieldLines, fieldRecords, fieldText } from "../../field-values";
import { BlockGrid, BlockHeading, BlockLink } from "../shared/shared";
import type { BlockProps } from "../types";

export function PricingBlock({ content, options }: BlockProps) {
  return (
    <>
      <BlockHeading value={content.heading} />
      <BlockGrid columns={options.columns}>
        {fieldRecords(content.items).map((item, index) => (
          <article key={index} className={item.featured ? "co-card co-featured" : "co-card"}>
            <h3>{fieldText(item.name)}</h3>
            <strong className="co-metric">{fieldText(item.price)}</strong>
            <p>{fieldText(item.description)}</p>
            <ul>{fieldLines(item.inclusions).map((line, lineIndex) => <li key={lineIndex}>{line}</li>)}</ul>
            <BlockLink to={item.actionHref} button>{fieldText(item.actionLabel)}</BlockLink>
          </article>
        ))}
      </BlockGrid>
    </>
  );
}
