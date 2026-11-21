import { HomepageRoute, homepageMetadata } from "@/features/platform-home/route";

export function generateMetadata() {
  return homepageMetadata("ru");
}

export default function Page() {
  return <HomepageRoute locale="ru" />;
}
