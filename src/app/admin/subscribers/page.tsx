"use client";

import { useEffect, useState } from "react";
import { Trash2, Users, RefreshCw, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Subscriber {
  _id: string;
  name?: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filtered, setFiltered] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subscribers", { credentials: "include" });
      const data = await res.json();
      setSubscribers(data.subscribers || []);
      setFiltered(data.subscribers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      subscribers.filter(
        (s) =>
          s.email.toLowerCase().includes(q) ||
          (s.name || "").toLowerCase().includes(q)
      )
    );
  }, [search, subscribers]);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    setDeleting(id);
    try {
      await fetch("/api/admin/subscribers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
        credentials: "include",
      });
      setSubscribers((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="admin-page-shell admin-page-shell--lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Subscribers</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {subscribers.length} total · {subscribers.filter((s) => s.isActive).length} active
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchSubscribers}
          className="gap-2 rounded-xl self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl bg-card"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-[length:var(--spacing-fl-admin-loading-y)] text-muted-foreground">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading subscribers…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-[length:var(--spacing-fl-admin-empty-y)] text-muted-foreground">
            <Users className="h-10 w-10 opacity-30" />
            <p className="text-sm">
              {search ? "No matching subscribers found." : "No subscribers yet."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold hidden md:table-cell">Phone</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold hidden sm:table-cell">Joined</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sub) => (
                <TableRow key={sub._id} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    {sub.name || <span className="text-muted-foreground italic text-xs">—</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{sub.email}</TableCell>
                  <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
                    {sub.phone || <span className="italic text-xs">—</span>}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={sub.isActive ? "default" : "secondary"}
                      className={
                        sub.isActive
                          ? "bg-[#A8DADC]/20 text-[#2C9C9F] border-[#A8DADC]/30 hover:bg-[#A8DADC]/20"
                          : ""
                      }
                    >
                      {sub.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm hidden sm:table-cell">
                    {formatDate(sub.createdAt)}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleDelete(sub._id)}
                      disabled={deleting === sub._id}
                      aria-label="Delete subscriber"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
