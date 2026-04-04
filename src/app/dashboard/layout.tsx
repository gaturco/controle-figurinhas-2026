import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardNav from '@/components/DashboardNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  return (
    <div className="min-h-screen">
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
}