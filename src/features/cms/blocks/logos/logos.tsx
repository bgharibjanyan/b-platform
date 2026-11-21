import { fieldRecords, fieldText } from "../../field-values";
import { safeHref } from "../../safe";
import { BlockHeading, BlockImage, BlockLink } from "../shared/shared";
import type { BlockProps } from "../types";

export function LogosBlock({ content, options }: BlockProps) {
  const density = fieldText(options.density) ?? "compact";
  const filter = options.color === "grayscale" ? "grayscale(1)" : undefined;

  return (
    <>
      <BlockHeading value={content.heading} />
      <div className={`co-logo-list co-logo-${density}`} style={{ flexWrap: options.wrap ? "wrap" : "nowrap" }}>
        {fieldRecords(content.items).map((item, index) => {
          const image = <BlockImage source={item.logo} alt={item.name} style={{ filter }} />;
          return <div key={index}>{safeHref(item.url) ? <BlockLink to={item.url}>{image}</BlockLink> : image}</div>;
        })}
      </div>
    </>
  );
}
