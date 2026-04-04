import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { stickerId, status, userId } = await req.json();

  if (status === "missing") {
    await sql`DELETE FROM colecao_usuario WHERE usuario_id = ${userId} AND figurinha_id = ${stickerId}`;
  } else {
    await sql`
      INSERT INTO colecao_usuario (usuario_id, figurinha_id, status)
      VALUES (${userId}, ${stickerId}, ${status})
      ON CONFLICT (usuario_id, figurinha_id) DO UPDATE SET status = EXCLUDED.status
    `;
  }

  return NextResponse.json({ ok: true });
}
