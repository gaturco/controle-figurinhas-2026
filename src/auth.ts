import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const rows = await sql`SELECT * FROM usuarios WHERE email = ${credentials.email as string} LIMIT 1`;
        const user = rows[0] as { id: number; email: string; nome: string; senha: string } | undefined;
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password as string, user.senha);
        if (!valid) return null;
        return { id: String(user.id), email: user.email, name: user.nome };
      },
    }),
  ],
  pages: { signIn: "/auth/login" },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) (session.user as { id?: string }).id = token.id as string;
      return session;
    },
  },
});
