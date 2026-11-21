import type { CSSProperties, ReactNode } from "react";
import { fieldLines, fieldText } from "../../field-values";
import { isSafeImage, parseInline, safeHref } from "../../safe";

export function BlockLink({ to, children, button = false }: {
  to: unknown;
  children: ReactNode;
  button?: boolean;
}) {
  const href = safeHref(to);
  if (!href || !children) return null;

  return <a className={button ? "co-button" : undefined} href={href}>{children}</a>;
}

export function BlockImage({ source, alt, style, priority }: {
  source: unknown;
  alt?: unknown;
  style?: CSSProperties;
  priority?: boolean;
}) {
  if (!isSafeImage(source)) return null;

  // The CMS supports configurable image URLs and inline preview assets.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="co-photo" src={String(source)} alt={fieldText(alt) ?? ""} style={style} fetchPriority={priority ? "high" : undefined} />;
}

export function InlineText({ value }: { value: unknown }) {
  return parseInline(fieldText(value) ?? "").map((item, index) =>
    item.kind === "link" ? <BlockLink key={index} to={item.href}>{item.text}</BlockLink> : item.text,
  );
}

export function Paragraphs({ value }: { value?: unknown }) {
  return fieldLines(value).map((line, index) => <p key={index}><InlineText value={line} /></p>);
}

export function BlockGrid({ columns, children }: { columns: unknown; children: ReactNode }) {
  const count = Number(columns);
  const style = { "--columns": [1, 2, 3, 4].includes(count) ? count : 3 } as CSSProperties;
  return <div className="co-grid" style={style}>{children}</div>;
}

export function BlockHeading({ value }: { value: unknown }) {
  const heading = fieldText(value);
  return heading ? <h2>{heading}</h2> : null;
}
