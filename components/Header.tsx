import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/chapters', label: 'Chapters' },
  { href: '/continue', label: 'Continue' },
  { href: '/upgrade', label: 'Upgrade' }
];

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200/70 bg-paper/90 backdrop-blur dark:border-zinc-700 dark:bg-moon/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-[0.2em] text-pine dark:text-emerald-300">
          SHOGUN
        </Link>
        <nav className="flex gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="wa-link">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
