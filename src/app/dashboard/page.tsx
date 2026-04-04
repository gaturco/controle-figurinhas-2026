import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import sql from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, XCircle, Copy } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [totalResult, collectedResult, repeatedResult] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM stickers`,
    sql`SELECT COUNT(*) as count FROM user_stickers WHERE user_id = ${userId} AND quantity >= 1`,
    sql`SELECT COALESCE(SUM(quantity - 1), 0) as count FROM user_stickers WHERE user_id = ${userId} AND quantity > 1`,
  ]);

  const total = Number(totalResult[0].count);
  const collected = Number(collectedResult[0].count);
  const repeated = Number(repeatedResult[0].count);
  const missing = total - collected;
  const progress = total > 0 ? Math.round((collected / total) * 100) : 0;

  const stats = [
    { label: 'Total', value: total, icon: BookOpen, className: 'text-blue-500' },
    { label: 'Coletadas', value: collected, icon: CheckCircle, className: 'text-green-500' },
    { label: 'Faltando', value: missing, icon: XCircle, className: 'text-destructive' },
    { label: 'Repetidas', value: repeated, icon: Copy, className: 'text-yellow-500' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Meu Álbum</h1>
        <p className="text-sm text-muted-foreground">Copa do Mundo 2026</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, className }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className={`h-4 w-4 ${className}`} />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

           <Card>
        <CardContent className="pt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{collected} de {total} figurinhas</span>
            <span className="font-semibold" style={{ color: 'var(--gold)' }}>{progress}%</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden bg-muted border border-border">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(to right, var(--gold), #e6c358)',
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">Progresso do álbum</p>
        </CardContent>
      </Card>

      <Button className="w-full" asChild>
        <Link href="/dashboard/stickers">
          <BookOpen className="mr-2 h-4 w-4" />
          Ver Todas as Figurinhas
        </Link>
      </Button>
    </div>
  );
}