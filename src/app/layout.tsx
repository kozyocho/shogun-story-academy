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
      <body className="bg-shogun-parchment text-shogun-ink font-serif min-h-screen">
        <Navigation />
        <main>{children}</main>
        <footer className="bg-shogun-dark text-white text-center py-6 mt-16 text-sm">
          <p>© {new Date().getFullYear()} Shogun Story Academy</p>
        </footer>
      </body>
    </html>
  );
}
