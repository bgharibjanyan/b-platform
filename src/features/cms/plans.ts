import type { Plan } from "./types";

const PLAN_RANK: Record<Plan, number> = { "4": 1, "10": 2, "25": 3 };
export const PLANS = ["4", "10", "25"] as const satisfies readonly Plan[];

export const PLAN_INFO: Record<Plan, { name: string; price: string; includes: string[] }> = {
  "4": {
    name: "Standard",
    price: "$4 / month",
    includes: [
      "12 standard blocks: hero, rich text, banner, image and text, services, showcase, gallery, hours, contact, CTA, testimonials, team",
      "Shared responsive company layout with header, navigation and footer",
      "Accent and background colors, logo and footer links",
      "Draft editing with review before publishing",
    ],
  },
  "10": {
    name: "Enhanced",
    price: "$10 / month",
    includes: [
      "Everything in $4",
      "8 enhanced blocks: logo strip, pricing, video, carousel, FAQ, tabs, animated metrics, timeline",
      "Shared preset themes (Editorial, Slate)",
    ],
  },
  "25": {
    name: "Custom",
    price: "$25 / month",
    includes: [
      "Everything in $10",
      "Company-specific elements custom-built by the B Platform team",
      "Custom themes and designs made for your brand",
    ],
  },
};

export function isEntitled(plan: Plan, blockPlan: Plan) {
  return PLAN_RANK[plan] >= PLAN_RANK[blockPlan];
}
