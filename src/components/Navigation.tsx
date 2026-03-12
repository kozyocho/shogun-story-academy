import Link from "next/link";
import { auth, signIn, signOut } from "@/lib/auth";

export async function Navigation() {
  const session = await auth();

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

        {session?.user ? (
          <div className="flex items-center gap-3">
            <span className="text-gray-300">{session.user.name}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="bg-shogun-red hover:bg-red-800 px-4 py-2 rounded text-white transition-colors min-h-[44px] min-w-[44px]"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button
              type="submit"
              className="bg-shogun-gold hover:bg-yellow-500 text-shogun-dark px-4 py-2 rounded font-semibold transition-colors min-h-[44px] min-w-[44px]"
            >
              Sign in
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}
