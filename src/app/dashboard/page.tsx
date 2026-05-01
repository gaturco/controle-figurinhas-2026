import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import sql from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, XCircle, Copy } from 'lucide-react';
import Link from 'next/link';
import ShareRepeatedButton from '@/components/ShareRepeatedButton';
import { ALBUM_GROUPS, NON_TEAM_PREFIXES } from '@/lib/data';

function parseTrailingInt(value: unknown) {
  const match = String(value).match(/(\d+)\s*$/);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

function toSortableNumber(value: unknown) {
  if (typeof value === 'number') return value;
  const trailing = parseTrailingInt(value);
  if (trailing !== null) return trailing;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : Number.MAX_SAFE_INTEGER;
}

function parseStickerCode(value: unknown) {
  const raw = String(value).trim();
  const cleaned = raw.replace(/[-_\s]+/g, '');
  const match = cleaned.match(/^([a-z]{2,10})0*(\d+)$/i);
  if (!match) return { prefix: null as string | null, index: null as number | null, raw };
  return { prefix: match[1].toUpperCase(), index: Number(match[2]), raw };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [totalResult, collectedResult, repeatedResult, repeatedListResult] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM stickers`,
    sql`SELECT COUNT(*) as count FROM user_stickers WHERE user_id = ${userId} AND quantity >= 1`,
    sql`SELECT COALESCE(SUM(quantity - 1), 0) as count FROM user_stickers WHERE user_id = ${userId} AND quantity > 1`,
    sql`
      SELECT s.number, us.quantity
      FROM user_stickers us
      JOIN stickers s ON s.id = us.sticker_id
      WHERE us.user_id = ${userId} AND us.quantity > 1
    `,
  ]);

  const total = Number(totalResult[0].count);
  const collected = Number(collectedResult[0].count);
  const repeated = Number(repeatedResult[0].count);
  const missing = total - collected;
  const progress = total > 0 ? Math.round((collected / total) * 100) : 0;

  const repeatedItems = repeatedListResult
    .map((r: Record<string, any>) => {
      const qty = Number(r.quantity);
      return {
        number: String(r.number),
        repeats: Number.isFinite(qty) ? Math.max(0, qty - 1) : 0,
      };
    })
    .filter((i: { number: string; repeats: number }) => i.repeats > 0);

  const groupOrder = new Map(Array.from('ABCDEFGHIJKL').map((g, idx) => [g, idx]));
  const teamOrder = new Map<string, { groupRank: number; teamRank: number }>();
  for (const [groupLetter, codes] of Object.entries(ALBUM_GROUPS)) {
    const groupRank = groupOrder.get(groupLetter) ?? 99;
    codes.forEach((code, teamRank) => {
      teamOrder.set(code.toUpperCase(), { groupRank, teamRank });
    });
  }

  const nonTeamPrefixSet = new Set(NON_TEAM_PREFIXES);

  const repeatedOrdered = [...repeatedItems].sort((a, b) => {
    const ac = parseStickerCode(a.number);
    const bc = parseStickerCode(b.number);
    const ap = ac.prefix ?? '';
    const bp = bc.prefix ?? '';

    const aIsNonTeam = ap === '' || nonTeamPrefixSet.has(ap);
    const bIsNonTeam = bp === '' || nonTeamPrefixSet.has(bp);
    if (aIsNonTeam !== bIsNonTeam) return aIsNonTeam ? -1 : 1;

    if (aIsNonTeam && bIsNonTeam) {
      if (ap !== bp) return ap.localeCompare(bp);
      const ai = ac.index ?? toSortableNumber(a.number);
      const bi = bc.index ?? toSortableNumber(b.number);
      if (ai !== bi) return ai - bi;
      return a.number.localeCompare(b.number);
    }

    const ao = teamOrder.get(ap);
    const bo = teamOrder.get(bp);
    const agr = ao?.groupRank ?? 99;
    const bgr = bo?.groupRank ?? 99;
    if (agr !== bgr) return agr - bgr;
    const atr = ao?.teamRank ?? 99;
    const btr = bo?.teamRank ?? 99;
    if (atr !== btr) return atr - btr;
    if (ap !== bp) return ap.localeCompare(bp);
    const ai = ac.index ?? toSortableNumber(a.number);
    const bi = bc.index ?? toSortableNumber(b.number);
    if (ai !== bi) return ai - bi;
    return a.number.localeCompare(b.number);
  });

  const stats = [
    { label: 'Total', value: total, icon: BookOpen, className: 'text-blue-500' },
    { label: 'Coletadas', value: collected, icon: CheckCircle, className: 'text-green-500', href: '/dashboard/stickers?status=collected' },
    { label: 'Faltando', value: missing, icon: XCircle, className: 'text-destructive', href: '/dashboard/stickers?status=missing' },
    { label: 'Repetidas', value: repeated, icon: Copy, className: 'text-yellow-500', href: '/dashboard/stickers?status=repeated' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Meu Álbum</h1>
          <p className="text-sm text-muted-foreground">Copa do Mundo 2026</p>
        </div>
        <ShareRepeatedButton
          items={repeatedOrdered}
          className="h-10 px-3 text-sm whitespace-nowrap"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, className, href }) => {
          const content = (
            <>
              <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
                <Icon className={`h-4 w-4 ${className}`} />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold">{value}</div>
              </CardContent>
            </>
          );

          if (!href) return <Card key={label}>{content}</Card>;

          return (
            <Link
              key={label}
              href={href}
              className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card className="cursor-pointer transition-colors hover:bg-muted/50">{content}</Card>
            </Link>
          );
        })}
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

      <Button className="w-full h-12 text-base" asChild>
        <Link href="/dashboard/stickers">
          <BookOpen className="mr-2 h-4 w-4" />
          Ver Todas as Figurinhas
        </Link>
      </Button>
    </div>
  );
}
