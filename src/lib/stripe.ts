import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

// 金額は .env.local の STRIPE_*_PRICE_ID で管理する。
// Stripe ダッシュボードで Price を作成し、ID を環境変数に設定すること。
export const PLANS = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
    mode: "subscription" as const,
  },
  annual: {
    priceId: process.env.STRIPE_ANNUAL_PRICE_ID!,
    mode: "subscription" as const,
  },
  lifetime: {
    // Stripe で「一回払い（One-time）」の Price を作成してIDを設定する
    priceId: process.env.STRIPE_LIFETIME_PRICE_ID!,
    mode: "payment" as const,
  },
} satisfies Record<string, { priceId: string; mode: "subscription" | "payment" }>;

export type PlanKey = keyof typeof PLANS;
