import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { ALL_STICKERS } from "@/lib/data";
import { Package, CheckCircle2, XCircle, Copy } from "lucide-react";

async function getStats(userId: string) {
  try {
    const rows = await sql`SELECT status, COUNT(*) as count FROM colecao_usuario WHERE usuario_id = ${userId} GROUP BY status`;
    const collected = Number((rows as any[]).find((r) => r.status === "collected")?.count ?? 0);
    const repeated = Number((rows as any[]).find((r) => r.status === "repeated")?.count ?? 0);
    return { collected, repeated };
  } catch {
    return { collected: 0, repeated: 0 };
  }
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const { collected, repeated } = await getStats(userId);
  const total = ALL_STICKERS.length;
  const missing = total - collected;
  const percent = total > 0 ? Math.round((collected / total) * 100) : 0;

  const stats = [
    { label: "Total", value: total, icon: Package, color: "bg-[#1a2e4a]", textColor: "text-white" },
    { label: "Coletadas", value: collected, icon: CheckCircle2, color: "bg-emerald-500", textColor: "text-white" },
    { label: "Faltando", value: missing, icon: XCircle, color: "bg-amber-500", textColor: "text-white" },
    { label: "Repetidas", value: repeated, icon: Copy, color: "bg-[#c9a84c]", textColor: "text-white" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Minha Colecao</h1>
        <p className="text-slate-500 mt-1">Copa do Mundo 2026</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col gap-3">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${s.color}`}>
              <s.icon className={`w-5 h-5 ${s.textColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-700">Progresso Geral</h2>
          <span className="text-sm font-bold text-[#c9a84c]">{percent}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-[#1a2e4a] to-[#c9a84c] h-3 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-sm text-slate-500 mt-2">{collected} de {total} figurinhas coletadas</p>
      </div>

      <div className="flex gap-4">
        <a href="/dashboard/stickers" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a2e4a] text-white text-sm font-medium rounded-lg hover:bg-[#243d61] transition-colors">
          Ver todas as figurinhas
        </a>
      </div>
    </div>
  );
}
