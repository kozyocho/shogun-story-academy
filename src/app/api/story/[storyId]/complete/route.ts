import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { RANK_NAMES, calcRank, SCROLL_DEFS } from "@/lib/ranks";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ storyId: string }> }
) {
  const { storyId } = await params;
  const body = await req.json().catch(() => ({})) as {
    score?: number;
    total?: number;
    dojoCompleted?: boolean;
  };
  const score = typeof body.score === "number" ? body.score : 0;
  const total = typeof body.total === "number" ? body.total : 0;
  const dojoCompleted = body.dojoCompleted === true;

  const user = await getUser();
  if (!user?.id) {
    return NextResponse.json({ bushoEarned: 0, saved: false });
  }

  // Check if already completed (prevent duplicate busho)
  const existing = await prisma.storyProgress.findUnique({
    where: { userId_storyId: { userId: user.id, storyId } },
  });

  if (existing?.completed) {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    return NextResponse.json({
      bushoEarned: 0,
      totalBusho: dbUser?.busho ?? 0,
      rank: dbUser?.rank ?? 0,
      rankName: RANK_NAMES[dbUser?.rank ?? 0],
      rankUp: false,
      currentStreak: dbUser?.currentStreak ?? 0,
      longestStreak: dbUser?.longestStreak ?? 0,
      newScrolls: [],
      saved: true,
    });
  }

  const bushoEarned = 50 + score * 25 + (dojoCompleted ? 20 : 0);

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { scrolls: { select: { type: true } } },
  });

  const prevBusho = dbUser?.busho ?? 0;
  const newBusho = prevBusho + bushoEarned;
  const prevRank = dbUser?.rank ?? 0;
  const newRank = calcRank(newBusho);
  const rankUp = newRank > prevRank;

  // Streak calculation
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastRead = dbUser?.lastReadAt ? new Date(dbUser.lastReadAt) : null;
  const lastReadDay = lastRead
    ? new Date(lastRead.getFullYear(), lastRead.getMonth(), lastRead.getDate())
    : null;
  const dayDiff = lastReadDay
    ? Math.round((today.getTime() - lastReadDay.getTime()) / 86400000)
    : null;

  let newStreak = dbUser?.currentStreak ?? 0;
  if (dayDiff === null || dayDiff > 1) {
    newStreak = 1;
  } else if (dayDiff === 1) {
    newStreak = (dbUser?.currentStreak ?? 0) + 1;
  }
  const newLongest = Math.max(dbUser?.longestStreak ?? 0, newStreak);

  // Scroll eligibility
  const existingTypes = new Set(dbUser?.scrolls.map((s) => s.type) ?? []);
  const toAward: string[] = [];

  const completedCount = await prisma.storyProgress.count({
    where: { userId: user.id, completed: true },
  });
  const freeCount = await prisma.story.count({ where: { isPremium: false } });

  if (!existingTypes.has("FIRST_BLOOD")) toAward.push("FIRST_BLOOD");
  if (newStreak >= 3 && !existingTypes.has("STREAK_3")) toAward.push("STREAK_3");
  if (newStreak >= 7 && !existingTypes.has("STREAK_7")) toAward.push("STREAK_7");
  if (score === total && total > 0 && !existingTypes.has("PERFECT_QUIZ"))
    toAward.push("PERFECT_QUIZ");
  if (completedCount + 1 >= freeCount && !existingTypes.has("ALL_FREE"))
    toAward.push("ALL_FREE");
  if (dojoCompleted && !existingTypes.has("DOJO_MASTER"))
    toAward.push("DOJO_MASTER");

  await prisma.$transaction([
    prisma.storyProgress.upsert({
      where: { userId_storyId: { userId: user.id, storyId } },
      update: { completed: true, completedAt: now },
      create: { userId: user.id, storyId, completed: true, completedAt: now },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: {
        busho: newBusho,
        rank: newRank,
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastReadAt: dayDiff === 0 ? dbUser?.lastReadAt : now,
      },
    }),
    ...toAward.map((type) =>
      prisma.scroll.create({ data: { userId: user.id, type } })
    ),
  ]);

  const newScrolls = toAward.map((type) => ({
    type,
    ...(SCROLL_DEFS[type] ?? { name: type, flavor: "" }),
  }));

  return NextResponse.json({
    bushoEarned,
    totalBusho: newBusho,
    rank: newRank,
    rankName: RANK_NAMES[newRank],
    rankUp,
    currentStreak: newStreak,
    longestStreak: newLongest,
    newScrolls,
    saved: true,
  });
}
