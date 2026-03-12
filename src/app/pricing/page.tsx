"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PlanKey } from "@/lib/stripe";

// ▼ 金額はここで一元管理。Stripeの Price と合わせて設定する。
const MONTHLY_PRICE = 4.99; // USD / month
const ANNUAL_PRICE = 49;   // USD / year
const LIFETIME_PRICE = 98; // USD / one-time

const annualSavingPct = Math.round((1 - ANNUAL_PRICE / (MONTHLY_PRICE * 12)) * 100);
const lifetimeBreakevenMonths = Math.ceil(LIFETIME_PRICE / MONTHLY_PRICE);

const PLANS: {
  key: PlanKey;
  label: string;
  priceDisplay: string;
  period: string;
  badge?: string;
  highlight?: boolean;
  features: string[];
  note?: string;
  cta: string;
}[] = [
  {
    key: "monthly",
    label: "Monthly",
    priceDisplay: `$${MONTHLY_PRICE}`,
    period: "/ month",
    features: [
      "Full story library",
      "Vocabulary & cultural notes",
      "Timeline summaries",
      "Comprehension questions",
      "New stories every month",
    ],
    cta: "Start Monthly",
  },
  {
    key: "annual",
    label: "Annual",
    priceDisplay: `$${ANNUAL_PRICE}`,
    period: "/ year",
    badge: `Save ${annualSavingPct}%`,
    highlight: true,
    features: [
      "Everything in Monthly",
      `$${(ANNUAL_PRICE / 12).toFixed(2)}/mo equivalent`,
      "Priority access to new stories",
    ],
    cta: "Start Annual",
  },
  {
    key: "lifetime",
    label: "Lifetime",
    priceDisplay: `$${LIFETIME_PRICE}`,
    period: "one-time",
    badge: "Best long-term value",
    features: [
      "Everything in Annual",
      "Pay once, access forever",
      `Break-even after ${lifetimeBreakevenMonths} months vs monthly`,
      "All future content included",
    ],
    note: "No recurring charges",
    cta: "Get Lifetime Access",
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<PlanKey | null>(null);
  const router = useRouter();

  async function handleSubscribe(plan: PlanKey) {
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (res.status === 401) {
        router.push("/api/auth/signin");
        return;
      }

      const data = await res.json() as { url?: string; error?: string };
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-shogun-ink mb-3">Simple Pricing</h1>
        <p className="text-gray-600">
          Start free. Upgrade anytime to unlock the full story library.
        </p>
      </div>

      {/* Free tier */}
      <div className="mb-8 p-6 bg-white border border-gray-200 rounded-xl max-w-sm mx-auto text-center">
        <h2 className="text-xl font-bold text-shogun-ink mb-1">Free</h2>
        <p className="text-3xl font-bold text-shogun-ink mb-4">$0</p>
        <ul className="text-sm text-gray-600 space-y-2 mb-4 text-left">
          <li>✓ Introductory stories</li>
          <li>✓ Basic cultural notes</li>
        </ul>
        <p className="text-xs text-gray-400">No sign-up required to browse</p>
      </div>

      {/* Paid plans — stack on mobile, 3 cols on md+ */}
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.key}
            className={`relative flex flex-col p-6 rounded-xl border-2 text-left ${
              plan.highlight
                ? "border-shogun-gold bg-white shadow-lg"
                : "border-gray-300 bg-white"
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-shogun-gold text-shogun-dark text-xs font-bold px-3 py-1 rounded-full">
                {plan.badge}
              </span>
            )}

            <h2 className="text-xl font-bold text-shogun-ink mb-1">{plan.label}</h2>
            <p className="text-3xl font-bold text-shogun-ink">
              {plan.priceDisplay}
              <span className="text-base font-normal text-gray-500 ml-1">
                {plan.period}
              </span>
            </p>

            <ul className="text-sm text-gray-600 space-y-2 mt-5 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>

            {plan.note && (
              <p className="text-xs text-shogun-red font-medium mb-3">{plan.note}</p>
            )}

            <button
              onClick={() => handleSubscribe(plan.key)}
              disabled={loading === plan.key}
              className={`w-full py-3 rounded-lg font-semibold transition-colors min-h-[44px] disabled:opacity-60 ${
                plan.highlight
                  ? "bg-shogun-red hover:bg-red-800 text-white"
                  : "bg-shogun-ink hover:bg-gray-800 text-white"
              }`}
            >
              {loading === plan.key ? "Redirecting…" : plan.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        Payments processed securely by Stripe.{" "}
        Monthly &amp; annual plans can be canceled anytime.
      </p>
    </div>
  );
}
