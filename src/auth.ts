/* Dev fix: prod AUTH_* in .env.local should not steal OAuth redirects from localhost */
import "@/lib/auth/normalize-dev-auth-urls";

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      /* Only allow the one Gmail address defined in ADMIN_EMAIL */
      return user.email === process.env.ADMIN_EMAIL;
    },
    authorized({ auth: session }) {
      return !!session?.user;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  trustHost: true,
});
