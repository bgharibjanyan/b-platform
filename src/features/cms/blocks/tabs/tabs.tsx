import { useId, useState, type KeyboardEvent } from "react";
import { fieldRecords, fieldText } from "../../field-values";
import { BlockHeading, Paragraphs } from "../shared/shared";
import type { BlockProps } from "../types";

export function TabsBlock({ content, options }: BlockProps) {
  const initial = Math.max(0, (Number(options.initial) || 1) - 1);
  return (
    <>
      <BlockHeading value={content.heading} />
      <TabbedPanels key={initial} content={content} initial={initial} stacked={options.mobile === "stacked"} />
    </>
  );
}

function TabbedPanels({ content, initial, stacked }: {
  content: BlockProps["content"];
  initial: number;
  stacked: boolean;
}) {
  const id = useId();
  const tabs = fieldRecords(content.tabs);
  const [selection, select] = useState(initial);
  const active = Math.min(selection, tabs.length - 1);
  const tabId = (index: number) => `${id}-tab-${index}`;
  const panelId = (index: number) => `${id}-panel-${index}`;

  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let target: number;
    switch (event.key) {
      case "Home":
        target = 0;
        break;
      case "End":
        target = tabs.length - 1;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        target = (index - 1 + tabs.length) % tabs.length;
        break;
      case "ArrowRight":
      case "ArrowDown":
        target = (index + 1) % tabs.length;
        break;
      default:
        return;
    }
    event.preventDefault();
    select(target);
    document.getElementById(tabId(target))?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label={fieldText(content.heading) || "Sections"} className={stacked ? "co-controls co-tabs co-tabs-stack" : "co-controls co-tabs "}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            id={tabId(index)}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls={panelId(index)}
            tabIndex={active === index ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={event => handleKey(event, index)}
          >
            {fieldText(tab.label)}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div key={index} className="co-card" role="tabpanel" id={panelId(index)} aria-labelledby={tabId(index)} hidden={active !== index}>
          <h3>{fieldText(tab.title)}</h3>
          <Paragraphs value={tab.text} />
        </div>
      ))}
    </div>
  );
}
