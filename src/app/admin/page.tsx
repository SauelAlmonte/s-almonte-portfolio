"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, FolderOpen, FileText, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
  total: number;
  active: number;
}

const QUICK_ACTIONS = [
  { label: "Projects", href: "/admin/projects", icon: FolderOpen, desc: "Add & manage your project cards" },
  { label: "Skills", href: "/admin/skills", icon: Wrench, desc: "Update skill proficiency levels" },
  { label: "Resume", href: "/admin/resume", icon: FileText, desc: "Manage experience, education & certs" },
  { label: "Subscribers", href: "/admin/subscribers", icon: Users, desc: "View your subscriber list" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [statsHint, setStatsHint] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setStatsError(null);
      setStatsHint(null);
      try {
        const res = await fetch("/api/admin/stats", { credentials: "include" });
        const text = await res.text();
        if (cancelled) return;

        if (!text.trim()) {
          setStatsError(res.ok ? "Empty response from server." : `Request failed (${res.status}).`);
          return;
        }

        let data: { total?: number; active?: number; error?: string; hint?: string };
        try {
          data = JSON.parse(text) as {
            total?: number;
            active?: number;
            error?: string;
            hint?: string;
          };
        } catch {
          setStatsError("Could not parse server response.");
          return;
        }

        if (!res.ok) {
          setStatsError(typeof data.error === "string" ? data.error : `Request failed (${res.status}).`);
          setStatsHint(typeof data.hint === "string" ? data.hint : null);
          return;
        }

        setStats({ total: data.total ?? 0, active: data.active ?? 0 });
      } catch {
        if (!cancelled) setStatsError("Could not load subscriber stats.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="admin-page-shell admin-page-shell--lg">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-x-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back, Sauel. Here&apos;s an overview of your portfolio.
          </p>
        </div>
      </div>

      {statsError && (
        <div className="flex flex-col gap-[length:var(--spacing-fl-admin-stack-tight)]" role="alert">
          <p className="admin-alert rounded-xl text-sm text-destructive bg-destructive/10">{statsError}</p>
          {statsHint ? (
            <p className="admin-alert rounded-xl text-sm text-muted-foreground bg-muted/50 leading-relaxed">
              {statsHint}
            </p>
          ) : null}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-[length:var(--spacing-fl-admin-grid-gap)] sm:grid-cols-2 lg:grid-cols-4">
        {/* Total subscribers */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Total Subscribers
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold text-foreground">
              {stats ? stats.total : "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">People who opted in</p>
          </CardContent>
        </Card>

        {/* Active subscribers */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Active Subscribers
            </CardTitle>
            <UserCheck className="h-4 w-4 text-[#A8DADC]" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold text-foreground">
              {stats ? stats.active : "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Currently subscribed</p>
          </CardContent>
        </Card>

      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-[length:var(--spacing-fl-admin-stack-tight)]">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-[length:var(--spacing-fl-admin-grid-gap)] sm:grid-cols-2">
          {QUICK_ACTIONS.map(({ label, href, icon: Icon, desc }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-[length:var(--spacing-fl-admin-grid-gap)] p-[length:var(--spacing-fl-admin-card-pad)] rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group min-w-0"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground wrap-break-word">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
