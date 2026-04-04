'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import StickerCard from './StickerCard';

type Status = 'collected' | 'repeated' | 'missing';

interface Sticker {
  id: string;
  number: number;
  code: string;
  team: string;
  player_name: string;
  is_special: boolean;
  status: Status;
}

export default function StickersGrid({ stickers, teams }: { stickers: Sticker[]; teams: string[] }) {
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filtered = stickers.filter((s) => {
    const matchesSearch =
      search === '' ||
      s.player_name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase());
    const matchesTeam = selectedTeam === '' || s.team === selectedTeam;
    const matchesStatus = selectedStatus === '' || s.status === selectedStatus;
    return matchesSearch && matchesTeam && matchesStatus;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou código..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1628]"
          />
        </div>
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1628]"
        >
          <option value="">Todas as seleções</option>
          {teams.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1628]"
        >
          <option value="">Todos os status</option>
          <option value="collected">Coletadas</option>
          <option value="repeated">Repetidas</option>
          <option value="missing">Faltando</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-4">{filtered.length} figurinha(s)</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filtered.map((sticker) => (
          <StickerCard key={sticker.id} sticker={sticker} />
        ))}
      </div>
    </div>
  );
}