'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

function formatStickerNumber(value: string) {
  const raw = value.trim();
  const cleaned = raw.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ');

  const spaced = cleaned.match(/^([a-z]{2,10})\s*0*(\d+)$/i);
  if (spaced) return `${spaced[1].toUpperCase()} ${Number(spaced[2])}`;

  const compact = raw.match(/^([a-z]{2,10})0*(\d+)$/i);
  if (compact) return `${compact[1].toUpperCase()} ${Number(compact[2])}`;

  return cleaned;
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

type Item = { number: string; repeats: number };

export default function ShareRepeatedButton({ items, className }: { items: Item[]; className?: string }) {
  const [copied, setCopied] = useState(false);

  const enabledItems = items
    .map((i) => ({ number: i.number.trim(), repeats: i.repeats }))
    .filter((i) => i.number !== '' && i.repeats > 0);

  const text = enabledItems
    .map((i) => `- ${formatStickerNumber(i.number)} (${i.repeats}x)`)
    .join('\n');
  const disabled = enabledItems.length === 0;

  const handleCopy = async () => {
    if (disabled) return;
    await copyToClipboard(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Button className={className} onClick={handleCopy} disabled={disabled}>
      {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
      {disabled ? 'Sem repetidas' : copied ? 'Copiado' : 'Copiar repetidas'}
    </Button>
  );
}
