import { fieldRecords, fieldText } from "../../field-values";
import { BlockGrid, BlockHeading, BlockImage, BlockLink } from "../shared/shared";
import type { BlockProps } from "../types";

export function TeamBlock({ content, options }: BlockProps) {
  const portraitRadii = { circle: "50%", rounded: 16 } as const;
  const shape = fieldText(options.shape);
  const borderRadius = shape === "circle" || shape === "rounded" ? portraitRadii[shape] : 0;

  return (
    <>
      <BlockHeading value={content.heading} />
      <BlockGrid columns={options.columns}>
        {fieldRecords(content.items).map((person, index) => (
          <article className="co-card" key={index}>
            <BlockImage source={person.portrait} alt={person.alt} style={{ aspectRatio: fieldText(options.crop), borderRadius }} />
            <h3>{fieldText(person.name)}</h3>
            <small>{fieldText(person.role)}</small>
            <p>{fieldText(person.bio)}</p>
            <BlockLink to={person.url}>{fieldText(person.name)}</BlockLink>
          </article>
        ))}
      </BlockGrid>
    </>
  );
}
