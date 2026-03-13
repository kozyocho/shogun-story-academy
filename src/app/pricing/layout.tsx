import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start free, upgrade to unlock the full Shogun Story Academy library. Monthly ($7/mo) or annual ($49/yr) plans with full story access.",
  openGraph: {
    title: "Pricing | Shogun Story Academy",
    description:
      "Unlock the full library of samurai history stories. $7/month or $49/year.",
    url: "/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
