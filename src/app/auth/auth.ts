// src/app/auth/auth.ts
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        // Only your email may sign in at all
        async signIn({ user }) {
            return user.email === ADMIN_EMAIL;
        },
    },
    // v5 uses AUTH_SECRET. You can also omit this line entirely, and it will read from env.
    secret: process.env.AUTH_SECRET,
});
