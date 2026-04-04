'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, LogOut } from 'lucide-react';

export default function DashboardNav() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className="bg-[#0a1628] text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="font-bold text-[#c9a84c] text-lg">⚽ Copa 2026</span>
        <div className="flex gap-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
              pathname === '/dashboard' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <LayoutDashboard size={15} /> Dashboard
          </Link>
          <Link
            href="/dashboard/stickers"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
              pathname === '/dashboard/stickers' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <BookOpen size={15} /> Figurinhas
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-300">{session?.user?.name}</span>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <LogOut size={15} /> Sair
        </button>
      </div>
    </nav>
  );
}