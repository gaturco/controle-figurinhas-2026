import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import sql from '@/lib/db';
import { BookOpen, CheckCircle, XCircle, Copy } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [totalResult, collectedResult, repeatedResult] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM stickers`,
    sql`SELECT COUNT(*) as count FROM user_stickers WHERE user_id = ${userId} AND status = 'collected'`,
    sql`SELECT COUNT(*) as count FROM user_stickers WHERE user_id = ${userId} AND status = 'repeated'`,
  ]);

  const total = Number(totalResult[0].count);
  const collected = Number(collectedResult[0].count);
  const repeated = Number(repeatedResult[0].count);
  const missing = total - collected - repeated;
  const progress = total > 0 ? Math.round((collected / total) * 100) : 0;

  const stats = [
    { label: 'Total do Álbum', value: total, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Coletadas', value: collected, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Faltando', value: missing, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Repetidas', value: repeated, icon: Copy, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Meu Álbum</h1>
        <p className="text-gray-500 mt-1">Copa do Mundo 2026</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="font-medium text-gray-700">Progresso do Álbum</span>
          <span className="text-[#c9a84c] font-bold">{progress}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0a1628] to-[#c9a84c] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">{collected} de {total} figurinhas coletadas</p>
      </div>

      <Link
        href="/dashboard/stickers"
        className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#152238] transition-colors"
      >
        <BookOpen size={18} /> Ver Todas as Figurinhas
      </Link>
    </div>
  );
}