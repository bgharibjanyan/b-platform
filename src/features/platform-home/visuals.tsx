const icons = {
  arrow: "M4 12h15m-6-6 6 6-6 6",
  down: "M12 4v15m-6-6 6 6 6-6",
  chevron: "m6 9 6 6 6-6",
  left: "M20 12H5m6-6-6 6 6 6",
  external: "M6 18 18 6M9 6h9v9",
  menu: "M4 8h16M4 16h16",
  globe: "M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Zm0 0a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z",
  window: "M3 6h18v13H3zM3 10h18M6 8h.01M9 8h.01",
  search: "m16 16 4 4M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z",
  message: "M4 5h16v11H9l-5 4V5Zm4 5h8M8 13h5",
  plus: "M12 5v14M5 12h14",
  check: "m5 12 4 4 10-10",
} as const;

export function HomeIcon({ name }: { name: keyof typeof icons }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={icons[name]} /></svg>;
}

export function ProductPreview({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="bp-product">
    <div className="bp-product-top"><span /><span /><span /></div>
    <div className="bp-product-content">
      <span className="bp-product-flower">✿</span>
      <span className="bp-product-label">{subtitle}</span>
      <strong>{title}</strong>
      <span className="bp-product-lines"><i /><i /></span>
    </div>
    <div className="bp-product-art"><i /><i /><i /></div>
  </div>;
}
