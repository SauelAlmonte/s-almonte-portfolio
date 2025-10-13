// src/_lib/authz.ts
import type { NextRequest } from 'next/server';

type ReqWithAuth = NextRequest & {
    auth?: {
        user?: {
            email?: string | null;
        };
    };
};

export function getAuthEmail(req: NextRequest): string | undefined {
    const { auth } = req as ReqWithAuth;
    const email = auth?.user?.email;
    return typeof email === 'string' ? email : undefined;
}

export function isAdminRequest(req: NextRequest): boolean {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? '';
    return getAuthEmail(req) === ADMIN_EMAIL;
}
