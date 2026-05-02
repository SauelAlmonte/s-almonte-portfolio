"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { CATEGORY_META, type ProjectCategory } from "@/config/projects";
import { cn } from "@/lib/utils";

const PROJECT_CATEGORIES: ProjectCategory[] = ["fullstack", "backend", "cloud"];

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  order: number;
}

const EMPTY_FORM = { name: "", category: "fullstack" as ProjectCategory, proficiency: 75, order: 0 };

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [seedMessage, setSeedMessage] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    setSeedMessage(null);
    try {
      const res = await fetch("/api/admin/skills", { credentials: "include" });
      const text = await res.text();
      let data: { skills?: Skill[]; error?: string } = {};
      if (text.trim()) {
        try {
          data = JSON.parse(text) as { skills?: Skill[]; error?: string };
        } catch {
          setLoadError("Server returned invalid data (not JSON). Try restarting the dev server.");
          setSkills([]);
          return;
        }
      }
      if (!res.ok) {
        setLoadError(typeof data?.error === "string" ? data.error : `Request failed (${res.status})`);
        setSkills([]);
        return;
      }
      setSkills(data.skills ?? []);
    } catch {
      setLoadError("Could not load skills. Check your connection and MongoDB settings.");
      setSkills([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  const seedFromConfig = async () => {
    setSeeding(true);
    setLoadError(null);
    setSeedMessage(null);
    try {
      const res = await fetch("/api/admin/skills/seed", {
        method: "POST",
        credentials: "include",
      });
      const text = await res.text();
      let data: { message?: string; error?: string } = {};
      if (text.trim()) {
        try {
          data = JSON.parse(text) as { message?: string; error?: string };
        } catch {
          throw new Error("Invalid response from server");
        }
      }
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Sync failed");
      }
      setSeedMessage(typeof data.message === "string" ? data.message : "Skills synced from config.");
      await fetchSkills();
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Sync failed.");
    } finally {
      setSeeding(false);
    }
  };

  const openAdd = () => { setEditing(null); setForm({ ...EMPTY_FORM }); setOpen(true); };
  const openEdit = (s: Skill) => {
    setEditing(s);
    const cat = s.category as ProjectCategory;
    setForm({
      name: s.name,
      category: (cat === "fullstack" || cat === "backend" || cat === "cloud") ? cat : "fullstack",
      proficiency: s.proficiency,
      order: s.order,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setLoadError(null);
    try {
      const url = editing ? `/api/admin/skills/${editing._id}` : "/api/admin/skills";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const text = await res.text();
      let data: { error?: string } = {};
      if (text.trim()) {
        try {
          data = JSON.parse(text) as { error?: string };
        } catch {
          setLoadError("Could not save skill. Invalid server response.");
          return;
        }
      }
      if (!res.ok) {
        setLoadError(typeof data.error === "string" ? data.error : `Save failed (${res.status}).`);
        return;
      }
      await fetchSkills();
      setOpen(false);
    } catch {
      setLoadError("Could not save skill. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    setLoadError(null);
    try {
      const res = await fetch(`/api/admin/skills/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) {
        const text = await res.text();
        let err = `Delete failed (${res.status}).`;
        if (text.trim()) {
          try {
            const p = JSON.parse(text) as { error?: string };
            if (typeof p.error === "string") err = p.error;
          } catch { /* keep default */ }
        }
        setLoadError(err);
        return;
      }
      setSkills((s) => s.filter((x) => x._id !== id));
    } catch {
      setLoadError("Could not delete skill. Check your connection and try again.");
    }
  };

  const grouped = PROJECT_CATEGORIES.map((cat) => ({
    value: cat,
    label: CATEGORY_META[cat].label,
    badgeClass: cn("text-xs border", CATEGORY_META[cat].tagClass),
    skills: skills.filter((s) => s.category === cat).sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
  }));

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Skills</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {skills.length} total
            <span className="hidden sm:inline">
              {" "}
              — shown on the homepage Skills &amp; Projects section when MongoDB has rows; otherwise
              defaults from
              <code className="mx-1 text-xs bg-muted px-1 py-0.5 rounded">config/skills.ts</code>.
            </span>
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" /> Add Skill
        </Button>
      </div>

      {loadError && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl" role="alert">
          {loadError}
        </p>
      )}
      {seedMessage && (
        <p className="text-sm text-muted-foreground bg-muted/50 px-4 py-3 rounded-xl">{seedMessage}</p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-3">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      ) : skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 gap-4 text-center border border-dashed border-border rounded-xl px-6">
          <div className="space-y-1 max-w-md">
            <p className="text-sm font-semibold text-foreground">No skills in the database yet</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The homepage uses defaults from
              <code className="mx-1 text-xs bg-muted px-1 py-0.5 rounded">config/skills.ts</code>
              until you add rows here. Sync once to align Admin and CMS-backed content.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => seedFromConfig()}
            disabled={seeding}
            variant="outline"
            className="rounded-xl gap-2"
          >
            {seeding ? (
              <><RefreshCw className="h-4 w-4 animate-spin" /> Syncing…</>
            ) : (
              <><Download className="h-4 w-4" /> Sync from portfolio config</>
            )}
          </Button>
          <Button type="button" onClick={openAdd} variant="default" className="rounded-xl gap-2">
            <Plus className="h-4 w-4" /> Add skill manually
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl gap-2"
              disabled={seeding}
              onClick={() => seedFromConfig()}
            >
              {seeding ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Sync from config
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {grouped.map(({ value, label, badgeClass, skills: catSkills }) => (
              <div key={value} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-2">
                  <Badge variant="outline" className={badgeClass}>{label}</Badge>
                  <span className="text-xs text-muted-foreground shrink-0">{catSkills.length} skills</span>
                </div>
                <div className="p-3 space-y-2">
                  {catSkills.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No skills in this category</p>
                  ) : (
                    catSkills.map((s) => (
                      <div
                        key={s._id}
                        className="group flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted focus-within:bg-muted transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <span className="text-sm font-medium text-foreground truncate">{s.name}</span>
                            <span className="text-xs text-muted-foreground shrink-0">{s.proficiency}%</span>
                          </div>
                          <div className="h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-300"
                              style={{ width: `${s.proficiency}%` }}
                              role="progressbar"
                              aria-valuenow={s.proficiency}
                              aria-valuemin={1}
                              aria-valuemax={100}
                              aria-label={`${s.name} proficiency`}
                            />
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity shrink-0">
                          <button
                            type="button"
                            onClick={() => openEdit(s)}
                            className="p-1 rounded-md hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            aria-label={`Edit ${s.name}`}
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(s._id)}
                            className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                            aria-label={`Delete ${s.name}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                  <button
                    type="button"
                    onClick={() => { setForm({ ...EMPTY_FORM, category: value }); setEditing(null); setOpen(true); }}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors border border-dashed border-border mt-2 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add to {label}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Skill" : "Add Skill"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update name, category, proficiency, or sort order." : "Add a skill; it appears on the homepage Skills section under the chosen category."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label htmlFor="admin-skill-name" className="text-sm font-semibold">Skill Name *</Label>
              <Input
                id="admin-skill-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. React, Node.js, AWS…"
                className="rounded-xl bg-card"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-skill-category" className="text-sm font-semibold">Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v as ProjectCategory }))}
              >
                <SelectTrigger id="admin-skill-category" className="rounded-xl bg-card w-full min-w-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-100 rounded-xl" position="popper">
                  {PROJECT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="rounded-lg">
                      {CATEGORY_META[c].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="admin-skill-proficiency-slider" className="text-sm font-semibold">Proficiency</Label>
                <span id="admin-skill-proficiency-val" className="text-sm font-bold text-primary tabular-nums">{form.proficiency}%</span>
              </div>
              <Slider
                id="admin-skill-proficiency-slider"
                value={[form.proficiency]}
                onValueChange={([v]) => setForm((f) => ({ ...f, proficiency: v }))}
                min={1} max={100} step={1}
                className="w-full"
                aria-valuetext={`${form.proficiency}%`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Beginner</span><span>Intermediate</span><span>Expert</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-skill-order" className="text-sm font-semibold">Order</Label>
              <Input
                id="admin-skill-order"
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: +e.target.value }))}
                className="rounded-xl bg-card"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name.trim()} className="rounded-xl">
              {saving ? "Saving…" : editing ? "Save Changes" : "Add Skill"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
