import { fieldRecords, fieldText } from "../../field-values";
import { BlockGrid, BlockHeading, BlockImage, BlockLink } from "../shared/shared";
import type { BlockProps } from "../types";

export function TestimonialsBlock({ content, options }: BlockProps) {
  const cardClass = options.style === "bordered" ? "co-card co-bordered" : "co-card";

  return (
    <>
      <BlockHeading value={content.heading} />
      <BlockGrid columns={options.columns}>
        {fieldRecords(content.items).map((item, index) => (
          <figure className={cardClass} key={index}>
            <blockquote>{fieldText(item.quote)}</blockquote>
            <figcaption>
              <BlockImage source={item.portrait} style={{ width: 40, aspectRatio: "1", borderRadius: "50%" }} />
              <strong>{fieldText(item.name)}</strong>{" "}
              <small>{fieldText(item.role)}</small>{" "}
              <BlockLink to={item.source}>Source</BlockLink>
            </figcaption>
          </figure>
        ))}
      </BlockGrid>
    </>
  );
}
