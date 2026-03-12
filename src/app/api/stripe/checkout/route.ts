import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe, PLANS, type PlanKey } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json() as { plan: PlanKey };
  const { plan } = body;
  const selectedPlan = PLANS[plan];
  if (!selectedPlan) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  let subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  let customerId = subscription?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email!,
      name: session.user.name ?? undefined,
      metadata: { userId: session.user.id },
    });
    customerId = customer.id;

    subscription = await prisma.subscription.upsert({
      where: { userId: session.user.id },
      update: { stripeCustomerId: customerId },
      create: {
        userId: session.user.id,
        stripeCustomerId: customerId,
        status: "FREE",
      },
    });
  }

  const baseParams = {
    customer: customerId,
    payment_method_types: ["card"] as const,
    line_items: [{ price: selectedPlan.priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: { userId: session.user.id },
  };

  const checkoutSession =
    selectedPlan.mode === "payment"
      ? await stripe.checkout.sessions.create({ ...baseParams, mode: "payment" })
      : await stripe.checkout.sessions.create({
          ...baseParams,
          mode: "subscription",
          subscription_data: { metadata: { userId: session.user.id } },
        });

  return NextResponse.json({ url: checkoutSession.url });
}
