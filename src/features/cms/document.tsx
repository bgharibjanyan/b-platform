import type { ReactNode } from "react";
import "@/app/globals.css";
import "./styles/company.css";
import "./styles/admin.css";

export function CmsDocument({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
