import { fieldLines, fieldRecords } from "../../field-values";
import { BlockHeading, InlineText } from "../shared/shared";
import type { BlockProps } from "../types";

export function RichTextBlock({ content, options }: BlockProps) {
  return (
    <div className={options.textWidth === "narrow" ? "co-prose" : undefined} style={{ textAlign: options.align === "center" ? "center" : "left" }}>
      <BlockHeading value={content.heading} />
      {fieldRecords(content.blocks).map((item, index) => {
        if (item.kind === "paragraph") {
          return <p key={index}><InlineText value={item.text} /></p>;
        }

        const List = item.kind === "numbered" ? "ol" : "ul";
        return (
          <List key={index}>
            {fieldLines(item.text).map((line, lineIndex) => <li key={lineIndex}><InlineText value={line} /></li>)}
          </List>
        );
      })}
    </div>
  );
}
