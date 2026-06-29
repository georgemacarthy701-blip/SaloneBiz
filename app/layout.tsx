import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SaloneBiz - Professional Business Directory',
  description: 'Discover, connect, and grow with verified businesses on SaloneBiz. Your trusted marketplace for professional services.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="bg-gray-50 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
