'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeToggle from '@/components/ThemeToggle';

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

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Painel esquerdo */}
      <div className="hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-12">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <span className="text-2xl">⚽</span>
          <span style={{ color: 'var(--gold)' }}>Copa 2026</span>
        </div>
        <div>
          <blockquote className="text-2xl font-light leading-relaxed opacity-90">
            "O futebol é a coisa mais importante<br />das menos importantes."
          </blockquote>
          <p className="mt-4 opacity-50 text-sm">— Arrigo Sacchi</p>
        </div>
        <p className="text-sm opacity-40">© 2026 Controle de Figurinhas</p>
      </div>

      {/* Painel direito */}
      <div className="flex flex-col">
        <div className="flex justify-between items-center p-4 lg:justify-end">
          <div className="flex items-center gap-2 lg:hidden font-semibold">
            <span>⚽</span>
            <span>Copa 2026</span>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-8 pb-12">
          <Card className="w-full max-w-sm border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl">
                {mode === 'login' ? 'Bem-vindo de volta' : 'Criar nova conta'}
              </CardTitle>
              <CardDescription>
                {mode === 'login'
                  ? 'Entre com seu email e senha para continuar.'
                  : 'Preencha os dados abaixo para criar sua conta.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="João Silva"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="joao@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading
                    ? 'Aguarde...'
                    : mode === 'login'
                    ? 'Entrar'
                    : 'Criar conta'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {mode === 'login' ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
                <button
                  type="button"
                  onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {mode === 'login' ? 'Criar conta' : 'Entrar'}
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}