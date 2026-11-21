import { PLANS, PLAN_INFO } from "../../plans";
import type { Plan } from "../../types";

export function SubscriptionPanel({ currentPlan }: { currentPlan: Plan }) {
  return (
    <section className="cms-plans">
      <h2>Subscription options</h2>
      <div className="cms-plan-grid">
        {PLANS.map(plan => {
          const info = PLAN_INFO[plan];
          return (
            <article className={plan === currentPlan ? "cms-plan-active" : ""} key={plan}>
              <h3>{info.name}</h3>
              <strong>{info.price}</strong>
              {plan === currentPlan && <span>Current plan</span>}
              <ul>{info.includes.map(item => <li key={item}>{item}</li>)}</ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
