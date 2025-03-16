import { TopNavbar } from '@/components/top-navbar';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PALO Fitness Dashboard',
  description: 'Track your fitness achievements and earn rewards',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <TopNavbar />
          <div className="container mx-auto py-4">
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
