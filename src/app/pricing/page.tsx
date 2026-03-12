"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    key: "monthly",
    label: "Monthly",
    price: "$7",
    period: "/ month",
    features: [
      "Full story library",
      "Vocabulary & cultural notes",
      "Timeline summaries",
      "Comprehension questions",
      "New content monthly",
    ],
  },
  {
    key: "annual",
    label: "Annual",
    price: "$49",
    period: "/ year",
    badge: "Save ~40%",
    features: [
      "Everything in Monthly",
      "Best value",
      "Priority access to new stories",
    ],
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubscribe(plan: string) {
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
    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-bold text-shogun-ink mb-3">Simple Pricing</h1>
      <p className="text-gray-600 mb-12">
        Start free. Upgrade to unlock the full library.
      </p>

      {/* Free tier */}
      <div className="mb-8 p-6 bg-white border border-gray-200 rounded-xl max-w-sm mx-auto">
        <h2 className="text-xl font-bold text-shogun-ink mb-1">Free</h2>
        <p className="text-3xl font-bold text-shogun-ink mb-4">$0</p>
        <ul className="text-sm text-gray-600 space-y-2 mb-6 text-left">
          <li>✓ Introductory stories</li>
          <li>✓ Basic cultural notes</li>
        </ul>
        <p className="text-sm text-gray-400">No sign-up required to browse</p>
      </div>

      {/* Paid plans */}
      <div className="grid md:grid-cols-2 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.key}
            className="relative p-6 bg-white border-2 border-shogun-gold rounded-xl text-left"
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-shogun-gold text-shogun-dark text-xs font-bold px-3 py-1 rounded-full">
                {plan.badge}
              </span>
            )}
            <h2 className="text-xl font-bold text-shogun-ink mb-1">{plan.label}</h2>
            <p className="text-3xl font-bold text-shogun-ink mb-1">
              {plan.price}
              <span className="text-base font-normal text-gray-500">
                {plan.period}
              </span>
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mt-4 mb-6">
              {plan.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.key)}
              disabled={loading === plan.key}
              className="w-full bg-shogun-red hover:bg-red-800 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-60"
            >
              {loading === plan.key ? "Redirecting…" : `Get ${plan.label}`}
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-8">
        Payments are processed securely by Stripe. Cancel anytime.
      </p>
    </div>
  );
}
