import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { RANK_NAMES } from "@/lib/ranks";

export async function Navigation() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

  const dbUser = user
    ? await prisma.user.findUnique({
        where: { id: user.id },
        select: { currentStreak: true, rank: true },
      })
    : null;

  return (
    <nav className="bg-shogun-dark text-white px-4 py-3 flex items-center justify-between gap-2">
      <Link href="/" className="text-shogun-gold font-bold text-base sm:text-xl tracking-wide shrink-0">
        <span className="sm:hidden">⚔ SSA</span>
        <span className="hidden sm:inline">⚔ Shogun Story Academy</span>
      </Link>

      <div className="flex items-center gap-3 sm:gap-5 text-sm">
        <Link href="/stories" className="hover:text-shogun-gold transition-colors">
          Stories
        </Link>
        <Link href="/map" className="hover:text-shogun-gold transition-colors">
          Map
        </Link>
        <Link href="/pricing" className="hover:text-shogun-gold transition-colors">
          Pricing
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              {dbUser && dbUser.currentStreak > 0 && (
                <span className="text-shogun-gold font-semibold">
                  🔥 {dbUser.currentStreak}
                </span>
              )}
              <span className="text-gray-300">
                {dbUser ? RANK_NAMES[dbUser.rank ?? 0] : (user.user_metadata?.full_name ?? user.email)}
              </span>
            </div>
            <form
              action={async () => {
                "use server";
                const supabase = await createClient();
                await supabase.auth.signOut();
                redirect("/");
              }}
            >
              <button
                type="submit"
                className="bg-shogun-red hover:bg-red-800 px-4 py-2 rounded text-white transition-colors min-h-[44px]"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <form
            action={async () => {
              "use server";
              const supabase = await createClient();
              const { data } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                  redirectTo: `${APP_URL}/auth/callback`,
                },
              });
              if (data.url) redirect(data.url);
            }}
          >
            <button
              type="submit"
              className="bg-shogun-gold hover:bg-yellow-500 text-shogun-dark px-4 py-2 rounded font-semibold transition-colors min-h-[44px]"
            >
              Sign in
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}
