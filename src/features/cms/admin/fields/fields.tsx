import { useId, useState } from "react";
import { fieldRecords, fieldText } from "../../field-values";
import type { FieldDef, FieldValues, Issue } from "../../types";

type UpdateField = (key: string, value: unknown) => void;

interface FieldsProps {
  fields: FieldDef[];
  values: FieldValues;
  onChange: UpdateField;
  base?: string;
  issues?: Issue[];
}

function defaultFieldValue(field: FieldDef) {
  if (field.type === "boolean") return false;
  if (field.type === "select") return field.options?.[0]?.value ?? "";
  if (field.type === "list") return [];
  return "";
}

interface FieldControlProps {
  field: FieldDef;
  value: unknown;
  issue?: Issue;
  onChange: (value: unknown) => void;
}

function FieldControl({ field, value, issue, onChange }: FieldControlProps) {
  const inputValue = typeof value === "number" ? value : fieldText(value) ?? "";
  const labelId = useId();
  const hintId = useId();
  const errorId = useId();
  const accessibility = {
    "aria-labelledby": labelId,
    "aria-required": field.required || undefined,
    "aria-invalid": Boolean(issue) || undefined,
    "aria-describedby": [field.help && hintId, issue && errorId].filter(Boolean).join(" ") || undefined,
  };
  const hint = (
    <>
      {field.help && <small id={hintId}>{field.help}</small>}
      {issue && <small id={errorId} className="cms-error">{issue.message}</small>}
    </>
  );

  if (field.type === "boolean") {
    return (
      <label className="cms-check">
        <input type="checkbox" {...accessibility} checked={Boolean(value)} onChange={event => onChange(event.target.checked)} />
        <span id={labelId}>{field.label}</span>
        {hint}
      </label>
    );
  }

  let control;
  switch (field.type) {
    case "textarea":
      control = <textarea {...accessibility} value={inputValue} rows={3} onChange={event => onChange(event.target.value)} />;
      break;
    case "select":
      control = (
        <select {...accessibility} value={inputValue} onChange={event => onChange(event.target.value)}>
          {field.options?.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      );
      break;
    default: {
      const type = field.type === "date" || field.type === "time" || field.type === "number" ? field.type : "text";
      control = (
        <input
          type={type}
          value={inputValue}
          min={field.min}
          max={field.max}
          step={type === "number" ? "any" : undefined}
          {...accessibility}
          onChange={event => {
            const text = event.target.value;
            onChange(type === "number" && text ? Number(text) : text);
          }}
        />
      );
    }
  }
  return <label><span id={labelId}>{field.label}{field.required ? " *" : ""}</span>{control}{hint}</label>;
}

function RepeatableField({ field, value, onChange, issue, path, issues }: FieldControlProps & { path: string; issues: Issue[] }) {
  const items = fieldRecords(value);
  const fields = field.fields ?? [];
  const itemLabel = field.itemLabel || "item";
  const [newItem, setNewItem] = useState<number>();

  function insert() {
    const item = Object.fromEntries(fields.map(child => [child.key, defaultFieldValue(child)]));
    setNewItem(items.length);
    onChange([...items, item]);
  }

  function move(index: number, offset: -1 | 1) {
    const next = [...items];
    const destination = index + offset;
    [next[index], next[destination]] = [next[destination], next[index]];
    onChange(next);
  }

  return (
    <fieldset className="cms-repeat">
      <legend>{field.label}</legend>
      {issue && <small className="cms-error">{issue.message}</small>}
      {items.map((item, index) => {
        const title = field.titleKey && fieldText(item[field.titleKey]);
        return (
          <details key={index} open={items.length < 3 || newItem === index ||
            issues.some(entry => entry.path === path + "." + index || entry.path.startsWith(path + "." + index + ".")) || undefined}>
            <summary>{(title || `${field.itemLabel || "Item"} ${index + 1}`).slice(0, 56)}</summary>
            <Fields
              fields={fields}
              values={item}
              base={`${path}.${index}`}
              issues={issues}
              onChange={(key, nextValue) => onChange(items.map((current, position) =>
                index === position ? { ...current, [key]: nextValue } : current,
              ))}
            />
            <div className="cms-actions">
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0}>Move up</button>
              <button type="button" onClick={() => move(index, 1)} disabled={index + 1 === items.length}>Move down</button>
              <button type="button" onClick={() => onChange(items.filter((_, position) => position !== index))}>Remove</button>
            </div>
          </details>
        );
      })}
      <button type="button" disabled={field.max !== undefined && items.length >= field.max} onClick={insert}>
        Add {itemLabel}
      </button>
    </fieldset>
  );
}

export function Fields({ fields, values, onChange, base = "", issues = [] }: FieldsProps) {
  return (
    <div className="cms-fields">
      {fields.map(field => {
        const path = base ? `${base}.${field.key}` : field.key;
        const props = {
          field,
          value: values[field.key],
          issue: issues.find(issue => issue.path === path),
          onChange: (value: unknown) => onChange(field.key, value),
        };
        return field.type === "list"
          ? <RepeatableField key={field.key} {...props} path={path} issues={issues} />
          : <FieldControl key={field.key} {...props} />;
      })}
    </div>
  );
}
