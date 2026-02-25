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

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back, Sauel. Here&apos;s an overview of your portfolio.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <h2 className="text-base font-bold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUICK_ACTIONS.map(({ label, href, icon: Icon, desc }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
