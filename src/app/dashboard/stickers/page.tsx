import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import sql from '@/lib/db';
import StickersGrid from '@/components/StickersGrid';

export default async function StickersPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const rows = await sql`
    SELECT
      s.id, s.number, s.code, s.team, s.player_name, s.is_special,
      COALESCE(us.status, 'missing') as status
    FROM stickers s
    LEFT JOIN user_stickers us ON us.sticker_id = s.id AND us.user_id = ${userId}
    ORDER BY s.number
  `;

  const stickers = rows.map((r) => ({
    id: r.id,
    number: r.number,
    code: r.code,
    team: r.team,
    player_name: r.player_name,
    is_special: r.is_special,
    status: r.status as 'collected' | 'repeated' | 'missing',
  }));

  const teams = [...new Set(stickers.map((s) => s.team))].sort();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Figurinhas</h1>
      <StickersGrid stickers={stickers} teams={teams} />
    </div>
  );
}