/** Original abstract compositions rendered as inline SVG (no third-party image licensing). */
const PALETTES = [
  ["#efe8da", "#1f3a2e", "#c9b98f", "#2b2a26", "#7a8f6a"],
  ["#e9e4d8", "#3f5a4c", "#d7c8a4", "#1d1c1a", "#b0896b"],
  ["#e6e9ec", "#2e3e4f", "#a9b6c2", "#151a20", "#c08a5b"],
];

function rng(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export function abstractArt(seed: number, opts: { w?: number; h?: number; palette?: number; label?: string } = {}) {
  const w = opts.w ?? 1200;
  const h = opts.h ?? 900;
  const p = PALETTES[(opts.palette ?? seed) % PALETTES.length]!;
  const r = rng(seed * 97 + 13);
  let shapes = "";
  // architectural planes: windows, columns, a desk line and an arc
  const cols = 3 + Math.floor(r() * 3);
  for (let i = 0; i < cols; i++) {
    const x = (w / cols) * i + r() * 40;
    const cw = w / cols - 30 - r() * 40;
    const top = h * (0.12 + r() * 0.3);
    shapes += `<rect x="${x.toFixed(0)}" y="${top.toFixed(0)}" width="${cw.toFixed(0)}" height="${(h - top).toFixed(0)}" fill="${p[(i % 3) + 1]}" opacity="${(0.55 + r() * 0.4).toFixed(2)}"/>`;
  }
  const cx = w * (0.3 + r() * 0.4);
  shapes += `<circle cx="${cx.toFixed(0)}" cy="${(h * 0.3).toFixed(0)}" r="${(h * (0.12 + r() * 0.1)).toFixed(0)}" fill="${p[4]}" opacity="0.85"/>`;
  shapes += `<rect x="0" y="${(h * 0.78).toFixed(0)}" width="${w}" height="${(h * 0.22).toFixed(0)}" fill="${p[3]}" opacity="0.9"/>`;
  shapes += `<line x1="0" y1="${(h * 0.78).toFixed(0)}" x2="${w}" y2="${(h * 0.78).toFixed(0)}" stroke="${p[0]}" stroke-width="4"/>`;
  if (opts.label) {
    shapes += `<text x="${w / 2}" y="${h * 0.9}" font-family="Georgia,serif" font-size="${h * 0.08}" fill="${p[0]}" text-anchor="middle">${opts.label.replace(/[<>&"]/g, "")}</text>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${p[0]}"/>${shapes}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function logoArt(name: string, seed: number) {
  const p = PALETTES[seed % PALETTES.length]!;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80"><rect width="240" height="80" rx="10" fill="${p[0]}"/><circle cx="40" cy="40" r="20" fill="${p[1]}"/><rect x="30" y="30" width="20" height="20" fill="${p[4]}"/><text x="72" y="49" font-family="Georgia,serif" font-size="24" fill="${p[3]}">${name.replace(/[<>&"]/g, "")}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function portraitArt(initials: string, seed: number) {
  const p = PALETTES[seed % PALETTES.length]!;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="${p[2]}"/><circle cx="200" cy="160" r="70" fill="${p[1]}"/><rect x="90" y="250" width="220" height="150" rx="100" fill="${p[1]}"/><text x="200" y="175" font-family="Georgia,serif" font-size="56" fill="${p[0]}" text-anchor="middle">${initials.replace(/[<>&"]/g, "")}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
