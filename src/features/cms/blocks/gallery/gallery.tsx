import { fieldRecords, fieldText } from "../../field-values";
import { BlockGrid, BlockHeading, BlockImage } from "../shared/shared";
import type { BlockProps } from "../types";

export function GalleryBlock({ content, options }: BlockProps) {
  return (
    <>
      <BlockHeading value={content.heading} />
      <BlockGrid columns={options.columns}>
        {fieldRecords(content.images).map((image, index) => {
          const caption = fieldText(image.caption);
          return (
            <figure key={index}>
              <BlockImage source={image.src} alt={image.alt} style={{ aspectRatio: fieldText(options.ratio) }} />
              {Boolean(options.captions) && caption && <figcaption>{caption}</figcaption>}
            </figure>
          );
        })}
      </BlockGrid>
    </>
  );
}
