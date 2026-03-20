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
    <nav className="bg-shogun-dark border-b border-shogun-gold/20 text-white px-4 py-3 flex items-center justify-between gap-2">
      {/* Logo */}
      <Link
        href="/"
        className="font-display text-shogun-gold font-bold text-base sm:text-xl tracking-wide shrink-0 hover:text-yellow-400 transition-colors duration-200"
      >
        <span className="sm:hidden">⚔ SSA</span>
        <span className="hidden sm:inline">⚔ Shogun Story Academy</span>
      </Link>

      <div className="flex items-center gap-3 sm:gap-5 text-sm">
        {/* Nav links */}
        <Link
          href="/stories"
          className="text-gray-300 hover:text-shogun-gold transition-colors duration-200 tracking-wider text-xs sm:text-sm uppercase font-medium"
        >
          Stories
        </Link>
        <Link
          href="/map"
          className="text-gray-300 hover:text-shogun-gold transition-colors duration-200 tracking-wider text-xs sm:text-sm uppercase font-medium"
        >
          Map
        </Link>
        <Link
          href="/pricing"
          className="text-gray-300 hover:text-shogun-gold transition-colors duration-200 tracking-wider text-xs sm:text-sm uppercase font-medium"
        >
          Pricing
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            {/* Streak + rank */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              {dbUser && dbUser.currentStreak > 0 && (
                <span className="text-shogun-gold/80 font-semibold">
                  🔥 {dbUser.currentStreak}
                </span>
              )}
              <span className="text-shogun-gold/80 font-garamond italic">
                {dbUser ? RANK_NAMES[dbUser.rank ?? 0] : (user.user_metadata?.full_name ?? user.email)}
              </span>
            </div>
            {/* Sign out */}
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
                className="border border-shogun-red/60 text-shogun-red bg-transparent hover:bg-shogun-red hover:text-white px-4 py-2 rounded text-sm font-medium transition-all duration-200 min-h-[44px] tracking-wider"
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
              className="bg-shogun-gold hover:bg-yellow-400 text-shogun-dark px-4 py-2 rounded font-bold transition-all duration-200 min-h-[44px] tracking-wider text-sm"
            >
              Sign in
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}
