import { fieldRecords, fieldText } from "../../field-values";
import { BlockGrid, BlockHeading, BlockImage, BlockLink } from "../shared/shared";
import type { BlockProps } from "../types";

export function ShowcaseBlock({ content, options }: BlockProps) {
  return (
    <>
      <BlockHeading value={content.heading} />
      <BlockGrid columns={options.columns}>
        {fieldRecords(content.items).map((item, index) => {
          const name = fieldText(item.name);
          const price = fieldText(item.price);

          return (
            <article className="co-card" key={index}>
              <BlockImage source={item.image} alt={item.alt} style={{ aspectRatio: fieldText(options.crop) }} />
              <small>{fieldText(item.category)}</small>
              <h3>{name}</h3>
              <p>{fieldText(item.description)}</p>
              {Boolean(options.showPrices) && price && <strong>{price}</strong>}
              <BlockLink to={item.url}>{name}</BlockLink>
            </article>
          );
        })}
      </BlockGrid>
    </>
  );
}
