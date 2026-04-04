import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import Link from "next/link";
import { Trophy, LayoutGrid, LogOut } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/auth/login");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#1a2e4a] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#c9a84c]">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">Copa 2026</span>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                <LayoutGrid className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/dashboard/stickers" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Figurinhas
              </Link>
              <form action={async () => { "use server"; await signOut({ redirectTo: "/auth/login" }); }}>
                <button type="submit" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </form>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
