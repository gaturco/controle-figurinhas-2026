import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import sql from '@/lib/db';
import CompareClient from './CompareClient';

export default async function ComparePage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const rows = await sql`
    SELECT s.number
    FROM user_stickers us
    JOIN stickers s ON s.id = us.sticker_id
    WHERE us.user_id = ${userId} AND us.quantity >= 1
  `;

  const numbers = rows.map((r: Record<string, any>) => String(r.number));

  return <CompareClient userHaveNumbers={numbers} />;
}
