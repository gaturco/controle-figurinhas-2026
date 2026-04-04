'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StickerCard from './StickerCard';

interface Sticker {
  id: string;
  number: number;
  team: string;
  player_name: string;
  quantity: number;
}

const PAGE_SIZE = 20;

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '...')[] = [1];
  if (current > 3) pages.push('...');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

export default function StickersGrid({ stickers: initial, teams }: { stickers: Sticker[]; teams: string[] }) {
  const [stickers, setStickers] = useState(initial);
  const [search, setSearch] = useState('');
  const [teamSearch, setTeamSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [page, setPage] = useState(1);

  const filteredTeams = teams.filter((t) =>
    t.toLowerCase().includes(teamSearch.toLowerCase())
  );

  const updateQuantity = (id: string, qty: number) => {
    setStickers((prev) => prev.map((s) => (s.id === id ? { ...s, quantity: qty } : s)));
  };

  const filtered = stickers.filter((s) => {
    const matchesSearch =
      search === '' ||
      s.player_name.toLowerCase().includes(search.toLowerCase()) ||
      String(s.number).includes(search);
    const matchesTeam = selectedTeam === 'all' || s.team === selectedTeam;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'collected' && s.quantity >= 1) ||
      (selectedStatus === 'repeated' && s.quantity > 1) ||
      (selectedStatus === 'missing' && s.quantity === 0);
    return matchesSearch && matchesTeam && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageNumbers = getPageNumbers(page, totalPages);

  useEffect(() => { setPage(1); }, [search, selectedTeam, selectedStatus]);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Buscar</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou número..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Seleção</Label>
          <Select value={selectedTeam} onValueChange={(v) => { setSelectedTeam(v); setTeamSearch(''); }}>
            <SelectTrigger>
              <SelectValue placeholder="Seleção" />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 pb-2 pt-1">
                <Input
                  placeholder="Buscar país..."
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  className="h-8 text-sm"
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
              <SelectItem value="all">Todas</SelectItem>
              {filteredTeams.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              {filteredTeams.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">Nenhum país encontrado</p>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Status</Label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="collected">Coletadas</SelectItem>
              <SelectItem value="repeated">Repetidas</SelectItem>
              <SelectItem value="missing">Faltando</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} figurinha(s) · página {page} de {totalPages}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
        {paginated.map((sticker) => (
          <StickerCard key={sticker.id} sticker={sticker} onQuantityChange={updateQuantity} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-2 flex-wrap">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {pageNumbers.map((p, i) =>
            p === '...' ? (
              <span key={`e-${i}`} className="px-1 text-muted-foreground text-sm">…</span>
            ) : (
              <Button key={p} variant={p === page ? 'default' : 'outline'} size="icon" className="h-8 w-8 text-xs" onClick={() => setPage(p)}>
                {p}
              </Button>
            )
          )}
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}