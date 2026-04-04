import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import sql from '@/lib/db';
import StickersGrid from '@/components/StickersGrid';

export default async function StickersPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const stickers = await sql`
    SELECT s.id, s.number, s.team, s.player_name, COALESCE(us.quantity, 0) as quantity
    FROM stickers s
    LEFT JOIN user_stickers us ON us.sticker_id = s.id AND us.user_id = ${userId}
    ORDER BY s.number ASC
  `;

  const teamsResult = await sql`SELECT DISTINCT team FROM stickers ORDER BY team ASC`;
  const teams = teamsResult.map((r: Record<string, any>) => r.team as string);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Figurinhas</h1>
        <p className="text-sm text-muted-foreground">Gerencie sua coleção</p>
      </div>
      <StickersGrid stickers={stickers as any} teams={teams} />
    </div>
  );
}