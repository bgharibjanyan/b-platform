import { HomepageRoute, homepageMetadata } from "@/features/platform-home/route";

export function generateMetadata() {
  return homepageMetadata("hy");
}

export default function Page() {
  return <HomepageRoute locale="hy" />;
}
