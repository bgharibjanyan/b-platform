import { fieldRecords, fieldText } from "../../field-values";
import { BlockHeading, Paragraphs } from "../shared/shared";
import type { BlockProps } from "../types";

export function TimelineBlock({ content, options }: BlockProps) {
  return (
    <>
      <BlockHeading value={content.heading} />
      <ol className={options.reveal ? "co-timeline co-reveal" : "co-timeline "}>
        {fieldRecords(content.items).map((item, index) => (
          <li key={index}>
            <span>{options.mode === "milestones" ? fieldText(item.date) || "•" : index + 1}</span>
            <div>
              <h3>{fieldText(item.title)}</h3>
              <Paragraphs value={item.description} />
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
