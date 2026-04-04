import { Sticker, Selecao } from "./types";

export const SELECOES: Selecao[] = [
  { id: 1, selecao: "Brasil", grupo: "A" },
  { id: 2, selecao: "Argentina", grupo: "B" },
  { id: 3, selecao: "Franca", grupo: "C" },
  { id: 4, selecao: "Alemanha", grupo: "D" },
  { id: 5, selecao: "Inglaterra", grupo: "E" },
  { id: 6, selecao: "Espanha", grupo: "F" },
  { id: 7, selecao: "Portugal", grupo: "G" },
  { id: 8, selecao: "Italia", grupo: "H" },
  { id: 9, selecao: "Holanda", grupo: "A" },
  { id: 10, selecao: "Belgica", grupo: "B" },
  { id: 11, selecao: "Croacia", grupo: "C" },
  { id: 12, selecao: "Uruguai", grupo: "D" },
  { id: 13, selecao: "Mexico", grupo: "E" },
  { id: 14, selecao: "EUA", grupo: "F" },
  { id: 15, selecao: "Japao", grupo: "G" },
  { id: 16, selecao: "Marrocos", grupo: "H" },
];

const playersMap: Record<number, string[]> = {
  1: ["Vinicius Jr.", "Rodrygo", "Endrick", "Casemiro", "Alisson"],
  2: ["Messi", "Di Maria", "Lautaro Martinez", "De Paul", "E. Martinez"],
  3: ["Mbappe", "Griezmann", "Dembele", "Kante", "Lloris"],
  4: ["Muller", "Kroos", "Musiala", "Havertz", "Neuer"],
  5: ["Bellingham", "Kane", "Saka", "Rashford", "Pickford"],
  6: ["Pedri", "Gavi", "Morata", "Yamal", "Unai Simon"],
  7: ["Cristiano Ronaldo", "B. Silva", "B. Fernandes", "Felix", "Rui Patricio"],
  8: ["Donnarumma", "Barella", "Chiesa", "Verratti", "Immobile"],
  9: ["Van Dijk", "Depay", "Dumfries", "Flekken", "Gakpo"],
  10: ["De Bruyne", "Lukaku", "Courtois", "Tielemans", "Carrasco"],
  11: ["Modric", "Kramaric", "Gvardiol", "Kovacic", "Livakovic"],
  12: ["Suarez", "Cavani", "Valverde", "Araujo", "Rochet"],
  13: ["Lozano", "Jimenez", "Guardado", "Ochoa", "Herrera"],
  14: ["Pulisic", "McKennie", "Turner", "Adams", "Weah"],
  15: ["Minamino", "Ito", "Doan", "Yoshida", "Gonda"],
  16: ["Hakimi", "Ziyech", "En-Nesyri", "Amrabat", "Bounou"],
};

let id = 1;
export const ALL_STICKERS: Sticker[] = [];

SELECOES.forEach((sel) => {
  const players = playersMap[sel.id] || [];
  const code = sel.selecao.substring(0, 3).toUpperCase();
  players.forEach((player, idx) => {
    ALL_STICKERS.push({
      id: id,
      numero: id,
      codigo: `${code}-${String(idx + 1).padStart(2, "0")}`,
      selecao_id: sel.id,
      selecao: sel.selecao,
      grupo: sel.grupo,
      nome_jogador: player,
      is_especial: idx === 0,
      secao: "Grupo",
      status: "missing",
    });
    id++;
  });
});

const especiais = ["Trofeu FIFA", "Mascote Oficial", "Estadio SoFi", "Estadio MetLife", "Mapa Copa 2026"];
especiais.forEach((nome, idx) => {
  ALL_STICKERS.push({
    id: id,
    numero: 500 + idx,
    codigo: `ESP-${String(idx + 1).padStart(2, "0")}`,
    selecao_id: null,
    selecao: "Especial",
    grupo: "-",
    nome_jogador: nome,
    is_especial: true,
    secao: "Especial",
    status: "missing",
  });
  id++;
});

export const ALL_TEAMS = ["Todos", ...SELECOES.map(s => s.selecao), "Especial"];
