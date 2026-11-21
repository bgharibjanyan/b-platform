import { useId } from "react";
import { fieldRecords, fieldText } from "../../field-values";
import { BlockHeading, Paragraphs } from "../shared/shared";
import type { BlockProps } from "../types";

export function FaqBlock({ content, options }: BlockProps) {
  const groupId = useId();
  const name = options.mode === "single" ? groupId : undefined;

  return (
    <>
      <BlockHeading value={content.heading} />
      {fieldRecords(content.items).map((item, index) => (
        <details className="co-faq" name={name} key={index} open={Number(options.initialOpen) === index + 1}>
          <summary>{fieldText(item.question)}</summary>
          <Paragraphs value={item.answer} />
        </details>
      ))}
    </>
  );
}
