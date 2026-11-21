import type { ReactNode } from "react";
import { HomepageDocument } from "@/features/platform-home/document";

export default function Layout({ children }: { children: ReactNode }) {
  return <HomepageDocument locale="ru">{children}</HomepageDocument>;
}
