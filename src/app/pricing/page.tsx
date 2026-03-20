"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PlanKey } from "@/lib/stripe";

const MONTHLY_PRICE = 4.99;
const ANNUAL_PRICE = 39;
const LIFETIME_PRICE = 98;

const annualSavingPct = Math.round((1 - ANNUAL_PRICE / (MONTHLY_PRICE * 12)) * 100);
const lifetimeBreakevenMonths = Math.ceil(LIFETIME_PRICE / MONTHLY_PRICE);

const PLANS: {
  key: PlanKey | "free";
  label: string;
  labelJa: string;
  priceDisplay: string;
  period: string;
  badge?: string;
  bestValue?: boolean;
  highlight?: boolean;
  features: string[];
  note?: string;
  cta: string;
  ctaStyle: "free" | "paid";
}[] = [
  {
    key: "free",
    label: "Free",
    labelJa: "入門",
    priceDisplay: "$0",
    period: "forever",
    features: [
      "Introductory stories",
      "Basic cultural notes",
    ],
    cta: "Start Free",
    ctaStyle: "free",
  },
  {
    key: "monthly",
    label: "Monthly",
    labelJa: "月極",
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
    ctaStyle: "paid",
  },
  {
    key: "annual",
    label: "Annual",
    labelJa: "年間",
    priceDisplay: `$${ANNUAL_PRICE}`,
    period: "/ year",
    badge: `Save ${annualSavingPct}%`,
    bestValue: true,
    highlight: true,
    features: [
      "Everything in Monthly",
      `$${(ANNUAL_PRICE / 12).toFixed(2)}/mo equivalent`,
      "Priority access to new stories",
    ],
    cta: "Start Annual",
    ctaStyle: "paid",
  },
  {
    key: "lifetime",
    label: "Lifetime",
    labelJa: "永久",
    priceDisplay: `$${LIFETIME_PRICE}`,
    period: "one-time",
    badge: "Best long-term value",
    features: [
      "Everything in Annual",
      "Pay once, access forever",
      `Break-even after ${lifetimeBreakevenMonths} months`,
      "All future content included",
    ],
    note: "No recurring charges",
    cta: "Get Lifetime Access",
    ctaStyle: "paid",
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
        window.location.href = "/api/auth/signin";
        return;
      }

      const data = await res.json() as { url?: string; error?: string };
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-shogun-dark relative">
      {/* Atmospheric kanji watermark */}
      <div
        aria-hidden="true"
        className="fixed inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span
          className="text-shogun-gold font-display leading-none"
          style={{ fontSize: "60vw", opacity: 0.015 }}
        >
          道
        </span>
      </div>

      {/* Top gold rule */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-shogun-gold/30 to-transparent"
      />

      <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-16">

        {/* ── Page Header ── */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-shogun-red" />
            <span className="text-shogun-red text-[11px] font-bold tracking-[0.35em] uppercase">
              UNLOCK THE FULL LIBRARY · 奥義解放
            </span>
            <div className="h-px w-8 bg-shogun-red" />
          </div>

          <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-4">
            Choose Your Path
          </h1>
          <p className="text-gray-400 font-garamond italic text-lg max-w-md mx-auto">
            Start free. Upgrade anytime to unlock the full story library.
          </p>

          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-shogun-gold/40" />
            <span className="text-shogun-gold/40 text-sm">⚔</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-shogun-gold/40" />
          </div>
        </div>

        {/* ── Plan Cards ── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <div
              key={plan.key}
              className={`relative flex flex-col rounded-xl p-6 text-left transition-all duration-300 ${
                plan.highlight
                  ? "bg-shogun-dark border-2 border-shogun-gold shadow-[0_0_30px_rgba(201,168,76,0.15)]"
                  : plan.key === "monthly"
                  ? "bg-gray-900 border border-shogun-gold/40 hover:border-shogun-gold/70"
                  : "bg-gray-900 border border-gray-700 hover:border-gray-500"
              }`}
            >
              {/* BEST VALUE badge */}
              {plan.bestValue && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-shogun-gold text-shogun-dark text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
                  BEST VALUE
                </span>
              )}

              {/* Save % badge (non-best-value) */}
              {plan.badge && !plan.bestValue && (
                <span className="inline-block mb-3 bg-shogun-gold/15 text-shogun-gold border border-shogun-gold/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase self-start">
                  {plan.badge}
                </span>
              )}

              {/* Plan name */}
              <div className="mb-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.25em] font-bold mb-1">
                  {plan.labelJa}
                </p>
                <h2 className="font-display font-bold text-xl text-white">
                  {plan.label}
                </h2>
              </div>

              {/* Price */}
              <div className="mb-5">
                <span className="text-shogun-gold font-display font-black text-4xl leading-none">
                  {plan.priceDisplay}
                </span>
                <span className="text-gray-500 text-sm ml-1 font-garamond">
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-shogun-gold mt-0.5 shrink-0 font-bold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {plan.note && (
                <p className="text-[11px] text-gray-500 font-garamond italic mb-4">{plan.note}</p>
              )}

              {/* CTA Button */}
              {plan.key === "free" ? (
                <a
                  href="/stories"
                  className="w-full py-3 rounded-lg text-sm font-bold text-center tracking-wider transition-all duration-200 min-h-[44px] flex items-center justify-center border border-gray-600 text-gray-300 hover:border-white hover:text-white"
                >
                  {plan.cta}
                </a>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.key as PlanKey)}
                  disabled={loading === plan.key}
                  className={`w-full py-3 rounded-lg text-sm font-bold tracking-wider transition-all duration-200 min-h-[44px] disabled:opacity-50 ${
                    plan.highlight
                      ? "bg-shogun-gold text-shogun-dark hover:bg-yellow-400 active:scale-[0.98]"
                      : "bg-shogun-gold text-shogun-dark hover:bg-yellow-400 active:scale-[0.98]"
                  }`}
                >
                  {loading === plan.key ? "Redirecting…" : plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ── Footer note ── */}
        <p className="text-gray-500 text-sm mt-10 text-center font-garamond">
          Payments processed securely by Stripe.{" "}
          Monthly &amp; annual plans can be canceled anytime.
        </p>
      </div>
    </div>
  );
}
