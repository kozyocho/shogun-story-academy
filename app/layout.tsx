import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import { ThemeToggle } from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Shogun Story Academy',
  description: '和風ストーリーで英語学習するモバイルファーストWebアプリ'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen">
        <Header />
        <Container>
          <main className="py-6">{children}</main>
          <div className="fixed bottom-4 right-4">
            <ThemeToggle />
          </div>
        </Container>
        <Footer />
      </body>
    </html>
  );
}
