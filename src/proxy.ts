import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // autoriza apenas se houver token (usuário logado)
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
