import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storyId: string }> }
) {
  const user = await getUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { storyId } = await params;

  const body = (await req.json()) as { score?: number; total?: number };
  const score = typeof body.score === "number" ? body.score : 0;

  const existing = await prisma.storyProgress.findUnique({
    where: { userId_storyId: { userId: user.id, storyId } },
  });

  if (existing?.completed) {
    return NextResponse.json({ xp: 0, alreadyCompleted: true });
  }

  await prisma.storyProgress.upsert({
    where: { userId_storyId: { userId: user.id, storyId } },
    update: { completed: true, completedAt: new Date() },
    create: { userId: user.id, storyId, completed: true, completedAt: new Date() },
  });

  const xp = 50 + score * 25;
  return NextResponse.json({ xp });
}
