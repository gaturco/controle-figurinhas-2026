'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
      {/* lado esquerdo — visual */}
      <div className="hidden lg:flex flex-col justify-between bg-[#0a1628] p-12 text-white">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <span className="text-2xl">⚽</span>
          <span className="text-[#c9a84c]">Copa 2026</span>
        </div>
        <div>
          <blockquote className="text-2xl font-light leading-relaxed text-gray-200">
            "O futebol é a coisa mais importante<br />das menos importantes."
          </blockquote>
          <p className="mt-4 text-gray-400">— Arrigo Sacchi</p>
        </div>
        <p className="text-sm text-gray-500">© 2026 Controle de Figurinhas</p>
      </div>

      {/* lado direito — formulário */}
      <div className="flex flex-col items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* logo mobile */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <span className="text-2xl">⚽</span>
            <span className="text-lg font-semibold text-[#0a1628]">Copa 2026</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'login' ? 'Bem-vindo de volta' : 'Criar nova conta'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {mode === 'login'
                ? 'Entre com seu email e senha para continuar.'
                : 'Preencha os dados abaixo para criar sua conta.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Nome completo</label>
                <input
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="João Silva"
                  className="w-full h-10 px-3 rounded-md border border-gray-300 text-sm outline-none focus:border-[#0a1628] focus:ring-2 focus:ring-[#0a1628]/20 transition"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="joao@email.com"
                className="w-full h-10 px-3 rounded-md border border-gray-300 text-sm outline-none focus:border-[#0a1628] focus:ring-2 focus:ring-[#0a1628]/20 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full h-10 px-3 rounded-md border border-gray-300 text-sm outline-none focus:border-[#0a1628] focus:ring-2 focus:ring-[#0a1628]/20 transition"
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-[#0a1628] hover:bg-[#152238] text-white text-sm font-medium rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Aguarde...'
                : mode === 'login'
                ? 'Entrar'
                : 'Criar conta'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {mode === 'login' ? (
              <>
                Não tem uma conta?{' '}
                <button
                  onClick={() => { setMode('register'); setError(''); }}
                  className="font-medium text-[#0a1628] hover:underline"
                >
                  Criar conta
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{' '}
                <button
                  onClick={() => { setMode('login'); setError(''); }}
                  className="font-medium text-[#0a1628] hover:underline"
                >
                  Entrar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}