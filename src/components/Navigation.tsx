import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function Navigation() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

  return (
    <nav className="bg-shogun-dark text-white px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-shogun-gold font-bold text-xl tracking-wide">
        ⚔ Shogun Story Academy
      </Link>

      <div className="flex items-center gap-6 text-sm">
        <Link href="/stories" className="hover:text-shogun-gold transition-colors">
          Stories
        </Link>
        <Link href="/pricing" className="hover:text-shogun-gold transition-colors">
          Pricing
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-gray-300 hidden sm:inline">
              {user.user_metadata?.full_name ?? user.email}
            </span>
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
