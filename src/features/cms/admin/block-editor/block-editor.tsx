import { useState } from "react";
import { sectionFields } from "../../definitions/section-fields";
import type { BlockDefinition } from "../../definitions/types";
import type { Block, Issue } from "../../types";
import { Fields } from "../fields/fields";

interface BlockEditorProps {
  block: Block;
  definition: BlockDefinition;
  issues: Issue[];
  onChange: (block: Block) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function BlockEditor({ block, definition, issues, onChange, onDuplicate, onDelete }: BlockEditorProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const hasSettingsIssues = issues.some(issue => !issue.path.startsWith("content.") && issue.path !== "type");
  return (
    <div className="cms-block-editor">
      <div className="cms-panel-heading">
        <h3>{block.label || definition.name}</h3>
        {block.label !== definition.name && <small>{definition.name}</small>}
      </div>
      {issues.length > 0 && <ul className="cms-error">{issues.map(issue => <li key={issue.path + issue.message}>{issue.message}</li>)}</ul>}
      <Fields
        fields={definition.fields}
        values={block.content}
        base="content"
        issues={issues}
        onChange={(key, value) => onChange({ ...block, content: { ...block.content, [key]: value } })}
      />
      <details className="cms-options" open={hasSettingsIssues || undefined}>
        <summary>Section settings</summary>
        <Fields
          fields={definition.options}
          values={block.options}
          base="options"
          issues={issues}
          onChange={(key, value) => onChange({ ...block, options: { ...block.options, [key]: value } })}
        />
        <Fields fields={sectionFields.filter(field => field.key !== "hidden")} values={{ ...block }} issues={issues} onChange={(key, value) => onChange({ ...block, [key]: value })} />
      </details>
      {confirmDelete ? (
        <div className="cms-remove-section">
          <p>Remove this section and its content from the draft?</p>
          <div className="cms-actions">
            <button type="button" onClick={() => setConfirmDelete(false)}>Cancel</button>
            <button type="button" className="admin-danger" onClick={onDelete}>Remove section</button>
          </div>
        </div>
      ) : (
        <div className="cms-actions">
          <button type="button" onClick={onDuplicate}>Duplicate</button>
          <button type="button" onClick={() => onChange({ ...block, hidden: !block.hidden })}>{block.hidden ? "Show section" : "Hide section"}</button>
          <button type="button" className="admin-text-danger" onClick={() => setConfirmDelete(true)}>Remove section…</button>
        </div>
      )}
    </div>
  );
}
