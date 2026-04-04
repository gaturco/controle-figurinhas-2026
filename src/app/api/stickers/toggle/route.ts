import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  const { stickerId, action } = await req.json();
  const userId = session.user.id;

  const existing = await sql`
    SELECT id, status FROM user_stickers WHERE user_id = ${userId} AND sticker_id = ${stickerId}
  `;

  if (action === 'remove') {
    await sql`DELETE FROM user_stickers WHERE user_id = ${userId} AND sticker_id = ${stickerId}`;
    return NextResponse.json({ status: 'missing' });
  }

  if (existing.length === 0) {
    await sql`INSERT INTO user_stickers (user_id, sticker_id, status) VALUES (${userId}, ${stickerId}, ${action})`;
  } else {
    await sql`UPDATE user_stickers SET status = ${action} WHERE user_id = ${userId} AND sticker_id = ${stickerId}`;
  }

  return NextResponse.json({ status: action });
}