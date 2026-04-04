
# 🏆 Copa 2026 - Meu Álbum Digital

Gerenciador digital de figurinhas da Copa do Mundo FIFA 2026. Com este app, você pode marcar suas figurinhas como **coletadas**, **faltantes** ou **repetidas** e acompanhar seu progresso até completar o álbum!

## 🛠 Tecnologias Utilizadas

- **Frontend:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend/Auth:** [Supabase](https://supabase.io/)
- **Deploy:** [Vercel](https://vercel.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)

## 🎯 Funcionalidades

- Autenticação de usuários via Supabase
- Dashboard com resumo do progresso do álbum
- Lista completa de figurinhas organizadas por seleção
- Sistema de marcação: coletada / faltante / repetida
- Filtros por seleção e busca por nome ou número da figurinha

## 🚀 Como Rodar o Projeto Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/copa2026-stickers-app.git
   ```

2. Entre na pasta do projeto:
   ```bash
   cd copa2026-stickers-app
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Crie um arquivo `.env.local` na raiz com suas variáveis do Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=SUA_URL_DO_SUPABASE
   NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
   ```

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

6. Acesse no navegador: [http://localhost:3000](http://localhost:3000)
# controle-figurinhas-2026
