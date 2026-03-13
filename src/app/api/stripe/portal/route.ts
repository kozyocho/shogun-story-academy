import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  if (!subscription?.stripeCustomerId) {
    return NextResponse.json({ error: "No subscription found" }, { status: 404 });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  });

  return NextResponse.json({ url: portalSession.url });
}
