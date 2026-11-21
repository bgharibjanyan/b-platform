/** Allowed link targets: http(s), mailto, tel, in-page anchors and site-relative paths. */
export function isSafeUrl(raw: unknown): boolean {
  if (typeof raw !== "string") return false;
  const v = raw.trim();
  if (!v) return false;
  if (v.startsWith("#")) return /^#[A-Za-z0-9\-_]+$/.test(v);
  if (v.startsWith("/") && !v.startsWith("//") && !v.includes("\\")) return true;
  if (/^mailto:[^\s@]+@[^\s@]+$/i.test(v)) return true;
  if (/^tel:\+?[0-9 ()\-]{4,}$/i.test(v)) return true;
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function safeHref(raw: unknown): string | undefined {
  return isSafeUrl(raw) ? String(raw).trim() : undefined;
}

export function isSafeImage(raw: unknown): boolean {
  if (typeof raw !== "string" || !raw.trim()) return false;
  const v = raw.trim();
  if (/^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml)[;,]/i.test(v)) return true;
  if (v.startsWith("/") && !v.startsWith("//") && !v.includes("\\")) return true;
  try {
    return new URL(v).protocol === "https:";
  } catch {
    return false;
  }
}

export type InlineToken = { kind: "text"; text: string } | { kind: "link"; text: string; href: string };

/** Parses `[label](url)` inline links; unsafe URLs degrade to plain text. No HTML is ever produced. */
export function parseInline(text: string): InlineToken[] {
  const out: InlineToken[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ kind: "text", text: text.slice(last, m.index) });
    const label = m[1] ?? "";
    const href = m[2] ?? "";
    if (isSafeUrl(href)) out.push({ kind: "link", text: label, href });
    else out.push({ kind: "text", text: label });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ kind: "text", text: text.slice(last) });
  return out;
}

export type VideoInfo = { provider: "youtube" | "vimeo"; id: string; embed: string };

export function parseVideo(raw: unknown): VideoInfo | null {
  if (typeof raw !== "string") return null;
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "https:") return null;
  const host = u.hostname.replace(/^www\./, "");
  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = u.pathname.startsWith("/embed/") ? u.pathname.split("/")[2] : u.searchParams.get("v");
    if (id && /^[\w-]{6,20}$/.test(id))
      return { provider: "youtube", id, embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1` };
  }
  if (host === "youtu.be") {
    const id = u.pathname.slice(1);
    if (/^[\w-]{6,20}$/.test(id))
      return { provider: "youtube", id, embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1` };
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = u.pathname.split("/").filter(Boolean).pop() ?? "";
    if (/^\d{5,12}$/.test(id)) return { provider: "vimeo", id, embed: `https://player.vimeo.com/video/${id}?autoplay=1` };
  }
  return null;
}

