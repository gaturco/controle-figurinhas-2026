'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function normalizeStickerKey(value: string) {
  const raw = value.trim();
  if (!raw) return null;

  const cleaned = raw
    .replace(/[()]/g, ' ')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const match = cleaned.match(/([a-z]{2,10})\s*0*(\d+)/i);
  if (!match) return null;

  const prefix = match[1].toUpperCase();
  const number = Number(match[2]);
  if (!Number.isFinite(number)) return null;

  return `${prefix}${number}`;
}

function parseList(text: string) {
  const rawLines = text
    .split(/\r?\n/g)
    .map((l) => l.trim())
    .filter(Boolean);

  const keys: string[] = [];
  const invalid: string[] = [];

  for (const line of rawLines) {
    const normalized = normalizeStickerKey(line);
    if (!normalized) invalid.push(line);
    else keys.push(normalized);
  }

  const uniqueKeys = Array.from(new Set(keys));
  return { uniqueKeys, invalid, totalLines: rawLines.length };
}

function formatStickerKey(key: string) {
  const match = key.match(/^([A-Z]{2,10})(\d+)$/);
  if (!match) return key;
  return `${match[1]} ${Number(match[2])}`;
}

export default function CompareClient({ userHaveNumbers }: { userHaveNumbers: string[] }) {
  const [otherList, setOtherList] = useState('');

  const userHaveSet = useMemo(() => {
    const normalized = userHaveNumbers
      .map((n) => normalizeStickerKey(String(n)))
      .filter(Boolean) as string[];
    return new Set(normalized);
  }, [userHaveNumbers]);

  const parsedOther = useMemo(() => parseList(otherList), [otherList]);

  const results = useMemo(() => {
    const have: string[] = [];
    const missing: string[] = [];

    for (const key of parsedOther.uniqueKeys) {
      if (userHaveSet.has(key)) have.push(key);
      else missing.push(key);
    }

    return {
      have,
      missing,
    };
  }, [parsedOther.uniqueKeys, userHaveSet]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Comparar repetidas</h1>
        <p className="text-sm text-muted-foreground">Cole a lista de repetidas de outra pessoa</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Lista da outra pessoa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <textarea
            value={otherList}
            onChange={(e) => setOtherList(e.target.value)}
            placeholder={`Exemplo:\n- FWC 10 (1x)\n- BIH 13 (2x)\n- BRA 3 (1x)`}
            className="min-h-[140px] w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <p className="text-xs text-muted-foreground">
            {parsedOther.totalLines} linha(s) · {parsedOther.uniqueKeys.length} figurinha(s) reconhecida(s)
            {parsedOther.invalid.length > 0 ? ` · ${parsedOther.invalid.length} inválida(s)` : ''}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Eu já tenho</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {results.have.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {results.have.map((k) => (
                  <span key={k} className="rounded-md border bg-muted/40 px-2 py-1 text-xs font-medium">
                    {formatStickerKey(k)}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Me faltam</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {results.missing.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {results.missing.map((k) => (
                  <span key={k} className="rounded-md border bg-muted/40 px-2 py-1 text-xs font-medium">
                    {formatStickerKey(k)}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {parsedOther.invalid.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Linhas não reconhecidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {parsedOther.invalid.slice(0, 20).map((l, idx) => (
              <p key={`${idx}-${l}`} className="text-xs text-muted-foreground">
                {l}
              </p>
            ))}
            {parsedOther.invalid.length > 20 && (
              <p className="text-xs text-muted-foreground">… e mais {parsedOther.invalid.length - 20}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
