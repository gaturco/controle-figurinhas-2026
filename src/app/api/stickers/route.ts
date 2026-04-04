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
    SELECT id, quantity FROM user_stickers WHERE user_id = ${userId} AND sticker_id = ${stickerId}
  `;

  if (action === 'collect') {
    if (existing.length === 0) {
      await sql`INSERT INTO user_stickers (user_id, sticker_id, quantity) VALUES (${userId}, ${stickerId}, 1)`;
      return NextResponse.json({ quantity: 1 });
    }
    return NextResponse.json({ quantity: existing[0].quantity });
  }

  if (action === 'increment') {
    if (existing.length === 0) {
      await sql`INSERT INTO user_stickers (user_id, sticker_id, quantity) VALUES (${userId}, ${stickerId}, 2)`;
      return NextResponse.json({ quantity: 2 });
    }
    const newQty = existing[0].quantity + 1;
    await sql`UPDATE user_stickers SET quantity = ${newQty} WHERE user_id = ${userId} AND sticker_id = ${stickerId}`;
    return NextResponse.json({ quantity: newQty });
  }

  if (action === 'decrement') {
    if (existing.length === 0) return NextResponse.json({ quantity: 0 });
    const newQty = existing[0].quantity - 1;
    if (newQty <= 0) {
      await sql`DELETE FROM user_stickers WHERE user_id = ${userId} AND sticker_id = ${stickerId}`;
      return NextResponse.json({ quantity: 0 });
    }
    await sql`UPDATE user_stickers SET quantity = ${newQty} WHERE user_id = ${userId} AND sticker_id = ${stickerId}`;
    return NextResponse.json({ quantity: newQty });
  }

  if (action === 'remove') {
    await sql`DELETE FROM user_stickers WHERE user_id = ${userId} AND sticker_id = ${stickerId}`;
    return NextResponse.json({ quantity: 0 });
  }

  return NextResponse.json({ error: 'Ação inválida.' }, { status: 400 });
}