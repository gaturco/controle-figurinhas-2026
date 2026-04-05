'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

type Mode = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'register') {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao criar conta.');
        setLoading(false);
        return;
      }
    }

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError('Email ou senha incorretos.');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-sm pt-6">
      <h1 className="text-2xl font-bold mb-6 leading-tight">
        Bem vindo ao sistema de controle de figurinhas da <span className="whitespace-nowrap">Copa do Mundo da FIFA 26&trade;!</span>
      </h1>
      
      <Card className="rounded-xl border bg-card text-card-foreground shadow">
        <CardContent className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">Nome completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="João Silva"
                  data-1p-ignore
                  className="text-base h-12"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="joao@email.com"
                data-1p-ignore
                className="text-base h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                data-1p-ignore
                className="text-base h-12"
              />
            </div>

            {error && (
              <div className="text-base text-destructive bg-destructive/10 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
              {loading
                ? 'Aguarde...'
                : mode === 'login'
                ? 'Entrar'
                : 'Criar conta'}
            </Button>
          </form>

          <p className="mt-6 text-center text-base text-muted-foreground">
            {mode === 'login' ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="font-medium text-primary underline-offset-4 hover:underline text-base"
            >
              {mode === 'login' ? 'Criar conta' : 'Entrar'}
            </button>
          </p>
        </CardContent>
      </Card>
      
      <div className="flex justify-center mt-8">
        <img
          src="/wc2026-logo.svg"
          alt="Copa 2026"
          className="h-12 w-auto dark:invert"
        />
      </div>
    </div>
  );
}