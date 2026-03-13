import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { stripe, PLANS, type PlanKey } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json() as { plan: PlanKey };
  const { plan } = body;
  const selectedPlan = PLANS[plan];
  if (!selectedPlan) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  let subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  let customerId = subscription?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      name: user.user_metadata?.full_name ?? undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;

    subscription = await prisma.subscription.upsert({
      where: { userId: user.id },
      update: { stripeCustomerId: customerId },
      create: {
        userId: user.id,
        stripeCustomerId: customerId,
        status: "FREE",
      },
    });
  }

  const commonParams = {
    customer: customerId,
    line_items: [{ price: selectedPlan.priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: { userId: user.id },
  };

  const checkoutSession =
    selectedPlan.mode === "payment"
      ? await stripe.checkout.sessions.create({ ...commonParams, mode: "payment" })
      : await stripe.checkout.sessions.create({
          ...commonParams,
          mode: "subscription",
          subscription_data: { metadata: { userId: user.id } },
        });

  return NextResponse.json({ url: checkoutSession.url });
}
