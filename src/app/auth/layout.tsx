import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="wc-gradient-bar" />
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <img
              src="/wc2026-logo.svg"
              alt="Copa 2026"
              className="h-8 w-auto dark:invert"
            />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="flex items-start justify-center min-h-[calc(100vh-4rem)] pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}