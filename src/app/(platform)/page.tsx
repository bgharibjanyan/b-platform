import { HomepageRoute, homepageMetadata } from "@/features/platform-home/route";

export function generateMetadata() {
  return homepageMetadata("en");
}

export default function Page() {
  return <HomepageRoute locale="en" />;
}
