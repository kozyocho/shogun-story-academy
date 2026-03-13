import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Supabase ユーザーを Prisma DB に同期（初回サインイン時に作成）
      await prisma.user.upsert({
        where: { id: data.user.id },
        update: {
          email: data.user.email!,
          name: data.user.user_metadata?.full_name ?? null,
          image: data.user.user_metadata?.avatar_url ?? null,
        },
        create: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.full_name ?? null,
          image: data.user.user_metadata?.avatar_url ?? null,
        },
      });

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`);
}
