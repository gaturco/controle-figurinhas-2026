"use client";
import { useState, useCallback } from "react";
import { Sticker, StickerStatus } from "@/lib/types";
import { ALL_TEAMS } from "@/lib/data";
import { Search, Star, Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_CYCLE: Record<StickerStatus, StickerStatus> = {
  missing: "collected",
  collected: "repeated",
  repeated: "missing",
};

const STATUS_LABEL: Record<StickerStatus, string> = {
  missing: "Faltando",
  collected: "Coletada",
  repeated: "Repetida",
};

const STATUS_STYLE: Record<StickerStatus, string> = {
  missing: "bg-white border-slate-200 text-slate-400",
  collected: "bg-emerald-50 border-emerald-400 text-emerald-700",
  repeated: "bg-amber-50 border-amber-400 text-amber-700",
};

interface Props {
  initialStickers: Sticker[];
  userId: string;
}

function formatStickerCode(code: string) {
  const value = code.trim();
  const cleaned = value.replace(/[-_]+/g, " ").replace(/\s+/g, " ");

  const match = cleaned.match(/^([a-z]{2,10})\s*0*(\d+)$/i);
  if (match) return `${match[1].toUpperCase()} ${Number(match[2])}`;

  const compactMatch = value.match(/^([a-z]{2,10})0*(\d+)$/i);
  if (compactMatch) return `${compactMatch[1].toUpperCase()} ${Number(compactMatch[2])}`;

  return cleaned;
}

export default function StickerGrid({ initialStickers, userId }: Props) {
  const [stickers, setStickers] = useState(initialStickers);
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("Todos");
  const [saving, setSaving] = useState<Set<number>>(new Set());

  const filtered = stickers.filter((s) => {
    const matchTeam = teamFilter === "Todos" || s.selecao === teamFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.nome_jogador.toLowerCase().includes(q) ||
      s.codigo.toLowerCase().includes(q) ||
      formatStickerCode(s.codigo).toLowerCase().includes(q);
    return matchTeam && matchSearch;
  });

  const toggle = useCallback(async (id: number) => {
    setStickers((prev) =>
      prev.map((s) => s.id === id ? { ...s, status: STATUS_CYCLE[s.status] } : s)
    );
    setSaving((prev) => new Set(prev).add(id));
    const sticker = stickers.find((s) => s.id === id);
    if (!sticker) return;
    const nextStatus = STATUS_CYCLE[sticker.status];
    try {
      await fetch("/api/stickers/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stickerId: id, status: nextStatus, userId }),
      });
    } finally {
      setSaving((prev) => { const n = new Set(prev); n.delete(id); return n; });
    }
  }, [stickers, userId]);

  const counts = stickers.reduce(
    (acc, s) => { acc[s.status]++; return acc; },
    { collected: 0, missing: 0, repeated: 0 } as Record<StickerStatus, number>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por jogador ou codigo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] bg-white"
          />
        </div>
        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] bg-white text-slate-700 min-w-[160px]"
        >
          {ALL_TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="flex gap-3 text-sm">
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">{counts.collected} coletadas</span>
        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">{counts.repeated} repetidas</span>
        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">{counts.missing} faltando</span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">Nenhuma figurinha encontrada.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((sticker) => (
            <button
              key={sticker.id}
              onClick={() => toggle(sticker.id)}
              disabled={saving.has(sticker.id)}
              className={cn(
                "relative border-2 rounded-xl p-3 text-left transition-all duration-150 hover:scale-105 hover:shadow-md active:scale-95 disabled:opacity-70",
                STATUS_STYLE[sticker.status]
              )}
            >
              {sticker.is_especial && (
                <Star className="absolute top-2 right-2 w-3.5 h-3.5 text-[#c9a84c] fill-[#c9a84c]" />
              )}
              {sticker.status === "collected" && (
                <Check className="absolute top-2 right-2 w-3.5 h-3.5 text-emerald-500" />
              )}
              {sticker.status === "repeated" && (
                <RefreshCw className="absolute top-2 right-2 w-3.5 h-3.5 text-amber-500" />
              )}
              <p className="text-xs font-bold opacity-60 mb-1">{formatStickerCode(sticker.codigo)}</p>
              <p className="text-xs font-semibold leading-tight line-clamp-2">{sticker.nome_jogador}</p>
              <p className="text-[10px] mt-1 opacity-50 truncate">{sticker.selecao}</p>
              <span className="mt-2 inline-block text-[10px] font-medium opacity-70">{STATUS_LABEL[sticker.status]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
