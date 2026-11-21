import { useRef, useState } from "react";
import { isEntitled } from "../../plans";
import { createBlock, getDef, newId, REGISTRY } from "../../registry";
import type { Block, Issue, Plan } from "../../types";
import { BlockEditor } from "../block-editor/block-editor";
import { AdminIcon } from "../workspace/workspace";

interface ContentPanelProps {
  blocks: Block[];
  plan: Plan;
  selectedId: string;
  issues: Record<string, Issue[]>;
  onSelect: (id: string) => void;
  onChange: (blocks: Block[]) => void;
}

export function ContentPanel({ blocks, plan, selectedId, issues, onSelect, onChange }: ContentPanelProps) {
  const [picker, setPicker] = useState("");
  const editor = useRef<HTMLDivElement>(null);
  const pickerControl = useRef<HTMLSelectElement>(null);
  const selected = blocks.find(block => block.id === selectedId) ?? blocks[0];
  const definition = selected && getDef(selected.type);

  function openSection(id: string) {
    onSelect(id);
    requestAnimationFrame(() => {
      editor.current?.focus({ preventScroll: true });
      editor.current?.scrollIntoView({ block: "nearest" });
    });
  }

  function addBlock() {
    const chosen = getDef(picker);
    if (!chosen || !isEntitled(plan, chosen.plan)) return;
    const block = createBlock(chosen.type);
    onChange([...blocks, block]);
    openSection(block.id);
    setPicker("");
  }

  function moveBlock(index: number, offset: -1 | 1) {
    const destination = index + offset;
    if (!blocks[destination]) return;
    const updated = [...blocks];
    [updated[index], updated[destination]] = [updated[destination], updated[index]];
    onChange(updated);
  }

  function duplicateBlock(block: Block) {
    const copy = { ...structuredClone(block), id: newId(), anchor: "", label: (block.label + " (copy)").slice(0, 80) };
    const index = blocks.findIndex(item => item.id === block.id);
    onChange([...blocks.slice(0, index + 1), copy, ...blocks.slice(index + 1)]);
    openSection(copy.id);
  }

  return (
    <>
      <div className="cms-panel-heading">
        <h2>Page sections</h2>
        <small>{blocks.length} {blocks.length === 1 ? "section" : "sections"}</small>
      </div>
      <div className="cms-insert">
        <label>Section type
          <select ref={pickerControl} value={picker} onChange={event => setPicker(event.target.value)}>
            <option value="">Choose a section</option>
            {REGISTRY.map(block => {
              const locked = !isEntitled(plan, block.plan);
              return (
                <option value={block.type} key={block.type} disabled={locked}>
                  {block.name}{locked ? " ($" + block.plan + " plan)" : ""}
                </option>
              );
            })}
          </select>
        </label>
        <button type="button" className="cms-primary" onClick={addBlock} disabled={!picker}><AdminIcon name="plus" /> Add section</button>
      </div>
      {blocks.length === 0 ? <p className="cms-empty">Choose a section type to start building this page.</p> : (
        <ol className="cms-sections" aria-label="Page section order">
          {blocks.map((block, index) => (
            <li key={block.id}>
              <button type="button" aria-pressed={selected?.id === block.id} onClick={() => openSection(block.id)}>
                <span>{block.label || "Untitled section"}</span>
                {block.hidden && <span className="cms-section-tag">Hidden</span>}
                {issues[block.id]?.length > 0 && <span className="cms-section-tag">Needs attention</span>}
              </button>
              <button type="button" title="Move up" aria-label={"Move " + block.label + " up"} disabled={index === 0} onClick={() => moveBlock(index, -1)}><AdminIcon name="up" /></button>
              <button type="button" title="Move down" aria-label={"Move " + block.label + " down"} disabled={index + 1 === blocks.length} onClick={() => moveBlock(index, 1)}><AdminIcon name="down" /></button>
            </li>
          ))}
        </ol>
      )}
      {selected && definition && (
        <div ref={editor} className="cms-section-detail" tabIndex={-1} role="group" aria-label={"Edit " + (selected.label || definition.name)}>
          <BlockEditor
            key={selected.id}
            block={selected}
            definition={definition}
            issues={issues[selected.id] ?? []}
            onChange={update => onChange(blocks.map(block => block.id === update.id ? update : block))}
            onDuplicate={() => duplicateBlock(selected)}
            onDelete={() => {
              const index = blocks.findIndex(block => block.id === selected.id);
              const next = blocks.filter(block => block.id !== selected.id);
              onChange(next);
              const nextSelection = next[Math.min(index, next.length - 1)];
              if (nextSelection) openSection(nextSelection.id);
              else {
                onSelect("");
                requestAnimationFrame(() => pickerControl.current?.focus());
              }
            }}
          />
        </div>
      )}
    </>
  );
}
