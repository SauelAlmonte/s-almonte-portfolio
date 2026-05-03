"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense, useEffect } from "react";
import { Lock, ChromeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const error = params.get("error");

  useEffect(() => {
    if (error === "AccessDenied") {
      router.replace("/");
    }
  }, [error, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-[length:var(--spacing-fl-admin-main-x)]">
      {/* Background blobs */}
      <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#A8DADC]/10 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#B39CD0]/10 blur-[100px]" />
      </div>

      <div className="w-full flex flex-col gap-[length:var(--spacing-fl-admin-stack)] max-w-[length:var(--spacing-fl-admin-login-max)]">
        {/* Header */}
        <div className="text-center flex flex-col gap-[length:var(--spacing-fl-admin-stack-tight)]">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in with your Google account to continue
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="admin-alert rounded-xl text-sm text-destructive bg-destructive/10 text-center">
            {error === "AccessDenied"
              ? "Access denied. Only the portfolio owner can sign in."
              : "Something went wrong. Please try again."}
          </p>
        )}

        {/* Google Sign In */}
        <Button
          onClick={() => {
            const origin =
              typeof window !== "undefined" ? window.location.origin : "";
            void signIn("google", {
              callbackUrl: origin ? `${origin}/admin` : "/admin",
            });
          }}
          size="lg"
          className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/25 transition-all duration-200 gap-3"
        >
          <ChromeIcon className="h-5 w-5" />
          Continue with Google
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          This area is restricted to the portfolio owner.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
