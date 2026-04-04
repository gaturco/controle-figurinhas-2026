import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { ALL_STICKERS } from "@/lib/data";
import { Sticker } from "@/lib/types";
import StickerGrid from "./StickerGrid";

async function getUserStickers(userId: string): Promise<Sticker[]> {
  try {
    const rows = await sql`SELECT figurinha_id, status FROM colecao_usuario WHERE usuario_id = ${userId}`;
    const map = new Map((rows as any[]).map((r) => [r.figurinha_id as number, r.status as string]));
    return ALL_STICKERS.map((s) => ({
      ...s,
      status: (map.get(s.id) as Sticker["status"]) ?? "missing",
    }));
  } catch {
    return ALL_STICKERS;
  }
}

export default async function StickersPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const stickers = await getUserStickers(userId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Figurinhas</h1>
        <p className="text-slate-500 mt-1">Clique em uma figurinha para alterar o status: Faltando → Coletada → Repetida</p>
      </div>
      <StickerGrid initialStickers={stickers} userId={userId} />
    </div>
  );
}
