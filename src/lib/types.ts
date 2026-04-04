export type StickerStatus = "collected" | "missing" | "repeated";

export interface Selecao {
  id: number;
  selecao: string;
  grupo: string;
}

export interface Sticker {
  id: number;
  numero: number;
  codigo: string;
  selecao_id: number | null;
  selecao?: string;
  grupo?: string;
  nome_jogador: string;
  is_especial: boolean;
  secao: string;
  status: StickerStatus;
}
