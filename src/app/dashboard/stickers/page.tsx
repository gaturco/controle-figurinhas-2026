import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import sql from '@/lib/db';
import StickersGrid from '@/components/StickersGrid';
import { ALBUM_GROUPS, NON_TEAM_PREFIXES } from '@/lib/data';

type DbSticker = {
  id: string;
  number: number | string;
  team: string;
  player_name: string;
  quantity: number;
};

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

const NON_TEAM_PREFIX_SET = new Set(NON_TEAM_PREFIXES);

export default async function StickersPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const stickers = (await sql`
    SELECT s.id, s.number, s.team, s.player_name, COALESCE(us.quantity, 0) as quantity
    FROM stickers s
    LEFT JOIN user_stickers us ON us.sticker_id = s.id AND us.user_id = ${userId}
  `) as unknown as DbSticker[];

  const teamsResult = await sql`SELECT DISTINCT team FROM stickers ORDER BY team ASC`;
  const teams = teamsResult.map((r: Record<string, any>) => r.team as string);

  const groupOrder = new Map(Array.from('ABCDEFGHIJKL').map((g, idx) => [g, idx]));
  const teamOrder = new Map<string, { groupRank: number; teamRank: number }>();
  for (const [groupLetter, codes] of Object.entries(ALBUM_GROUPS)) {
    const groupRank = groupOrder.get(groupLetter) ?? 99;
    codes.forEach((code, teamRank) => {
      teamOrder.set(code.toUpperCase(), { groupRank, teamRank });
    });
  }

  const sortedStickers = [...stickers].sort((a, b) => {
    const aCode = parseStickerCode(a.number);
    const bCode = parseStickerCode(b.number);

    const aPrefix = aCode.prefix;
    const bPrefix = bCode.prefix;

    const aIsNonTeam = !aPrefix || NON_TEAM_PREFIX_SET.has(aPrefix);
    const bIsNonTeam = !bPrefix || NON_TEAM_PREFIX_SET.has(bPrefix);
    if (aIsNonTeam !== bIsNonTeam) return aIsNonTeam ? -1 : 1;

    if (aIsNonTeam && bIsNonTeam) {
      const ap = aPrefix ?? '';
      const bp = bPrefix ?? '';
      if (ap !== bp) return ap.localeCompare(bp);
      const ai = aCode.index ?? toSortableNumber(a.number);
      const bi = bCode.index ?? toSortableNumber(b.number);
      if (ai !== bi) return ai - bi;
      return a.player_name.localeCompare(b.player_name);
    }

    const aTeam = aPrefix ?? '';
    const bTeam = bPrefix ?? '';
    const aOrder = teamOrder.get(aTeam);
    const bOrder = teamOrder.get(bTeam);

    const aGroupRank = aOrder?.groupRank ?? 99;
    const bGroupRank = bOrder?.groupRank ?? 99;
    if (aGroupRank !== bGroupRank) return aGroupRank - bGroupRank;

    const aTeamRank = aOrder?.teamRank ?? 99;
    const bTeamRank = bOrder?.teamRank ?? 99;
    if (aTeamRank !== bTeamRank) return aTeamRank - bTeamRank;

    if (aTeam !== bTeam) return aTeam.localeCompare(bTeam);

    const ai = aCode.index ?? toSortableNumber(a.number);
    const bi = bCode.index ?? toSortableNumber(b.number);
    if (ai !== bi) return ai - bi;
    return a.player_name.localeCompare(b.player_name);
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Figurinhas</h1>
        <p className="text-sm text-muted-foreground">Gerencie sua coleção</p>
      </div>
      <StickersGrid stickers={sortedStickers as any} teams={teams} />
    </div>
  );
}
