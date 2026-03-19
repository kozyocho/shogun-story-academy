import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Shogun Story Academy",
  description:
    "Learn samurai culture and Japan's Sengoku period through short, fact-based stories in English.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-shogun-parchment text-shogun-ink font-serif min-h-screen">
        <Navigation />
        <main>{children}</main>
        <footer className="bg-[#0d0b08] text-white/40 text-center py-6 mt-0 text-xs tracking-widest uppercase border-t border-white/8">
          <p>© {new Date().getFullYear()} Shogun Story Academy</p>
        </footer>
      </body>
    </html>
  );
}
