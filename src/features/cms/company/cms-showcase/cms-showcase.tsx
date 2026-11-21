import { useState } from "react";
import { Fields } from "../../admin/fields/fields";
import { isBannerVisible } from "../../blocks/banner/banner";
import { BlockSection } from "../../blocks/block-section/block-section";
import { sectionFields } from "../../definitions/section-fields";
import { samplePage } from "../../fixtures/sample";
import { getDef, REGISTRY } from "../../registry";
import type { Block } from "../../types";
import "./cms-showcase.css";

const contactLink = "mailto:hello@example.com";

function examples(): Block[] {
  return samplePage().map(block => {
    const { content } = block;
    switch (block.type) {
      case "contact":
        return { ...block, content: { ...content,
          phones: [{ label: "Example phone", number: "+1 202 555 0103" }],
          mapUrl: "https://www.openstreetmap.org/#map=12/40.1792/44.4991",
          links: [{ label: "Example message link", url: contactLink }],
        } };
      case "cta":
        return { ...block, content: { ...content, secondaryLabel: "Email the demo", secondaryHref: contactLink } };
      case "timeline":
        return { ...block, content: { ...content,
          items: [
            { title: "Draft", description: "Edit content privately.", date: "2026-11-20" },
            { title: "Review", description: "Submit for approval.", date: "2026-11-23" },
            { title: "Live", description: "Approved content becomes public.", date: "2026-11-25" },
          ],
        } };
      default:
        return block;
    }
  });
}

function Example({ block }: { block: Block }) {
  if (block.hidden || (block.type === "banner" && !isBannerVisible(block.content))) {
    return <p className="co-demo-hidden">This example is hidden by its current settings.</p>;
  }

  // Prefix example anchors so edits cannot introduce duplicate IDs on the company page.
  const rendered = { ...block, anchor: block.anchor ? "cms-demo-" + block.id + "-" + block.anchor : "" };
  const isBanner = block.type === "banner";
  const isTop = isBanner && block.options.placement === "top";

  return (
    <>
      {isBanner && !isTop && <div className="co-demo-page-reference">Example page content</div>}
      <BlockSection block={rendered} locale="en" example />
      {isTop && <div className="co-demo-page-reference">Example page content</div>}
    </>
  );
}

export function CmsShowcase() {
  const [original] = useState(examples);
  const [blocks, setBlocks] = useState(original);
  const [selectedId, select] = useState(() => original.find(block => block.type === "hero")!.id);
  const [showAll, setShowAll] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [resetCount, setResetCount] = useState(0);
  const selected = blocks.find(block => block.id === selectedId)!;
  const definition = getDef(selected.type)!;

  function update(change: (block: Block) => Block) {
    setBlocks(current => current.map(block => block.id === selectedId ? change(block) : block));
  }

  return (
    <section id="cms-showcase" className="co-cms-showcase" aria-labelledby="cms-showcase-title" lang="en">
      <div className="co-inner co-showcase-heading">
        <h2 id="cms-showcase-title">CMS showcase</h2>
        <p>Explore all {REGISTRY.length} blocks. Change settings to see the result immediately. These examples are separate from the published page.</p>
        <div className="co-showcase-toolbar">
          <label>
            Block
            <select aria-label="Block" value={selectedId} disabled={showAll} onChange={event => select(event.target.value)}>
              {blocks.map(block => <option key={block.id} value={block.id}>{getDef(block.type)?.name}</option>)}
            </select>
          </label>
          <div className="co-controls">
            <button type="button" onClick={() => setShowAll(value => !value)}>
              {showAll ? "Open block playground" : "View all blocks"}
            </button>
            <button type="button" aria-pressed={mobile} onClick={() => setMobile(value => !value)}>Mobile width</button>
            {!showAll && <button type="button" onClick={() => {
              update(() => original.find(block => block.id === selectedId)!);
              setResetCount(count => count + 1);
            }}>Reset example</button>}
          </div>
        </div>
      </div>
      {!showAll && (
        <div className="co-inner co-demo-settings">
          <details>
            <summary>Block and section settings</summary>
            <div className="co-demo-fields">
              <Fields fields={definition.options} values={selected.options} onChange={(key, value) => {
                update(block => ({ ...block, options: { ...block.options, [key]: value } }));
              }} />
              <Fields fields={sectionFields} values={{ ...selected }} onChange={(key, value) => {
                update(block => ({ ...block, [key]: value }));
              }} />
            </div>
          </details>
          <details>
            <summary>Example content</summary>
            <Fields key={selected.id} fields={definition.fields} values={selected.content} onChange={(key, value) => {
              update(block => ({ ...block, content: { ...block.content, [key]: value } }));
            }} />
          </details>
        </div>
      )}
      <div className="co-demo-frame" data-mobile={mobile} onClick={event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
        const link = event.target.closest("a")?.getAttribute("href");
        if (!link?.startsWith("#")) return;
        const target = blocks.find(block => block.anchor && "#" + block.anchor === link);
        if (!target) return;
        event.preventDefault();
        if (showAll) document.getElementById("cms-demo-item-" + target.id)?.scrollIntoView();
        else select(target.id);
      }}>
        {showAll ? blocks.map(block => (
          <div key={block.id} className="co-demo-item" id={"cms-demo-item-" + block.id}>
            <h3 className="co-inner co-demo-item-title">{getDef(block.type)?.name}</h3>
            <Example block={block} />
          </div>
        )) : (
          <div className="co-demo-item">
            <h3 className="co-inner co-demo-item-title">{definition.name} preview</h3>
            <Example key={selected.id + ":" + resetCount} block={selected} />
          </div>
        )}
      </div>
    </section>
  );
}
